using System.Collections.Generic;
using UnityEngine;

namespace Recreated
{
    public sealed class ExpeditionDirector : MonoBehaviour
    {
        public PlayerController player;
        public GameTuning tuning = new GameTuning();
        public int CurrentWave { get; private set; }
        public int Clears { get; private set; }
        private readonly List<EnemyController> enemies = new List<EnemyController>();
        private bool finished;
        private bool defeatRecorded;
        private ExpeditionProgress progress;
        
        private float nextWaveAt = -1f;
        private const float ChamberBreather = 1.8f;
        private void Start()
        {
            tuning.Validate();
            progress = ProgressStore.Load();
            SpawnWave();
        }
        private void Update()
        {
            if (player == null) return;
            if (player.Vitality.IsDead)
            {
                if (!defeatRecorded)
                {
                    defeatRecorded = true;
                    progress.RecordDefeat(CurrentWave);
                    ProgressStore.Save(progress);
                }
                return;
            }
            if (finished) return;
            enemies.RemoveAll(e => e == null || e.Vitality.IsDead);
            if (enemies.Count > 0) return;
            if (CurrentWave < tuning.wavesPerExpedition)
            {
                if (nextWaveAt < 0f)
                {
                    player.Vitality.Heal(player.Vitality.Maximum * .12f);
                    nextWaveAt = Time.time + ChamberBreather;
                }
                if (Time.time >= nextWaveAt)
                {
                    nextWaveAt = -1f;
                    SpawnWave();
                }
            }
            else
            {
                finished = true;
                Clears++;
                progress.RecordClear(CurrentWave);
                ProgressStore.Save(progress);
            }
        }
        public void Restart()
        {
            // Destroy is deferred until end of frame; disable actors immediately.
            foreach (EnemyController enemy in enemies)
            {
                if (enemy == null) continue;
                enemy.enabled = false;
                Collider body = enemy.GetComponent<Collider>();
                if (body != null) body.enabled = false;
                Destroy(enemy.gameObject);
            }
            enemies.Clear();
            CurrentWave = 0;
            finished = false;
            defeatRecorded = false;
            nextWaveAt = -1f;
            if (player != null) player.ResetForExpedition(new Vector3(0f, 1f, 0f));
            if (player != null) SpawnWave();
        }
        private void SpawnWave()
        {
            CurrentWave++;
            for (int i = 0; i < tuning.waveSize + CurrentWave - 1; i++)
            {
                float angle = i * Mathf.PI * 2f / (tuning.waveSize + CurrentWave - 1);
                Vector3 position = new Vector3(Mathf.Cos(angle) * 10f, .9f, Mathf.Sin(angle) * 10f);
                GameObject obj = GameObject.CreatePrimitive(PrimitiveType.Capsule);
                obj.name = "Shade " + CurrentWave + "-" + (i + 1);
                obj.transform.position = position;
                obj.transform.localScale = new Vector3(.9f, .9f, .9f);
                Renderer renderer = obj.GetComponent<Renderer>();
                renderer.material.color = new Color(.27f, .18f, .39f);
                GameObject hood = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                hood.name = "Shade — hood";
                hood.transform.SetParent(obj.transform, false);
                hood.transform.localPosition = new Vector3(0, .65f, .06f);
                hood.transform.localScale = new Vector3(.88f, .55f, .8f);
                Destroy(hood.GetComponent<SphereCollider>());
                hood.GetComponent<Renderer>().material.color = new Color(.14f, .11f, .22f);
                GameObject eyes = GameObject.CreatePrimitive(PrimitiveType.Cube);
                eyes.name = "Shade — luminous eyes";
                eyes.transform.SetParent(obj.transform, false);
                eyes.transform.localPosition = new Vector3(0, .65f, .45f);
                eyes.transform.localScale = new Vector3(.38f, .07f, .05f);
                Destroy(eyes.GetComponent<BoxCollider>());
                eyes.GetComponent<Renderer>().material.color = new Color(.79f, .58f, 1f);
                EnemyController enemy = obj.AddComponent<EnemyController>();
                obj.AddComponent<DamageFlash>();
                obj.AddComponent<EnemyWindupVisual>();
                enemy.Configure(player.transform, tuning);
                enemies.Add(enemy);
            }
        }
        private void OnGUI()
        {
            if (player == null) return;
            GUIStyle title = new GUIStyle(GUI.skin.label) { fontSize = 20, fontStyle = FontStyle.Bold };
            title.normal.textColor = new Color(.98f, .85f, .64f);
            float width = Mathf.Max(100f, Mathf.Min(344f, Screen.width - 28f));
            float content = Mathf.Max(1f, width - 32f);
            GUI.color = new Color(.035f, .055f, .09f, .9f);
            GUI.DrawTexture(new Rect(14, 14, width, 184), Texture2D.whiteTexture);
            GUI.color = new Color(.78f, .60f, .35f, .9f);
            GUI.DrawTexture(new Rect(14, 14, 3f, 184), Texture2D.whiteTexture);
            GUI.color = Color.white;
            GUI.color = new Color(.13f, .17f, .23f);
            GUI.DrawTexture(new Rect(26, 55, content, 4), Texture2D.whiteTexture);
            GUI.color = new Color(.93f, .75f, .48f);
            GUI.DrawTexture(new Rect(26, 55, content * Mathf.Clamp01(player.Vitality.Current / player.Vitality.Maximum), 4), Texture2D.whiteTexture);
            GUI.color = Color.white;
            GUI.Label(new Rect(26, 20, content, 30), "RECREATED  /  THE MIRE", title);
            GUI.Label(new Rect(26, 64, content, 22), "HEALTH   " + Mathf.CeilToInt(player.Vitality.Current) + " / " + player.Vitality.Maximum);
            GUI.Label(new Rect(26, 90, content, 22), finished ? "EXPEDITION CLEARED" : nextWaveAt >= 0f ? "NEXT CHAMBER IN " + Mathf.Max(0, Mathf.CeilToInt(nextWaveAt - Time.time)) + "s" : "CHAMBER " + CurrentWave + " / " + tuning.wavesPerExpedition + "   •   THREATS " + enemies.Count);
            GUI.Label(new Rect(26, 117, content, 20), "ECHOES " + (progress == null ? 0 : progress.earnedEchoes) + "   •   CLEARS " + (progress == null ? 0 : progress.completedRuns));
            float cooldownWidth = Mathf.Max(1f, Mathf.Min(112f, (content - 14f) * .5f));
            float pulseReady = Mathf.Clamp01(1f - (player.PulseReadyAt - Time.time) / Mathf.Max(.1f, player.tuning.pulseCooldown));
            float dodgeReady = Mathf.Clamp01(1f - (player.DodgeReadyAt - Time.time) / Mathf.Max(.1f, player.tuning.dodgeCooldown));
            GUI.Label(new Rect(26, 140, content, 20), width < 280f ? "PULSE  /  DODGE" : "Q / RB  PULSE        SHIFT / B  DODGE");
            GUI.color = new Color(.13f, .17f, .23f);
            GUI.DrawTexture(new Rect(26, 161, cooldownWidth, 5), Texture2D.whiteTexture);
            GUI.DrawTexture(new Rect(26 + cooldownWidth + 14, 161, cooldownWidth, 5), Texture2D.whiteTexture);
            GUI.color = new Color(.48f, .81f, 1f);
            GUI.DrawTexture(new Rect(26, 161, cooldownWidth * pulseReady, 5), Texture2D.whiteTexture);
            GUI.color = new Color(.93f, .75f, .48f);
            GUI.DrawTexture(new Rect(26 + cooldownWidth + 14, 161, cooldownWidth * dodgeReady, 5), Texture2D.whiteTexture);
            // Final visual detail: a restrained violet separator ties the HUD to the Echo Altar.
            GUI.color = new Color(.58f, .38f, .85f, .7f);
            GUI.DrawTexture(new Rect(26, 176, content, 1f), Texture2D.whiteTexture);
            GUI.color = Color.white;
            if (finished || player.Vitality.IsDead)
            {
                GUIStyle outcome = new GUIStyle(GUI.skin.label) { fontStyle = FontStyle.Bold, fontSize = 15 };
                outcome.normal.textColor = finished ? new Color(.93f, .75f, .48f) : new Color(1f, .55f, .5f);
                GUI.Label(new Rect(14, 194, width, 22), finished ? "THE MIRE ENDURES  •  +2 ECHOES" : "THE WEAVER HAS FALLEN", outcome);
                if (GUI.Button(new Rect(14, 222, Mathf.Min(180, width), 38), "RESTART EXPEDITION")) Restart();
            }
        }
    }
}
