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
        private float nextWaveAt = -1f;
        private const float ChamberBreather = 1.8f;
        private void Start()
        {
            tuning.Validate();
            SpawnWave();
        }
        private void Update()
        {
            if (finished || player == null || player.Vitality.IsDead) return;
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
            }
        }
        public void Restart()
        {
            foreach (EnemyController enemy in enemies) if (enemy != null) Destroy(enemy.gameObject);
            enemies.Clear();
            CurrentWave = 0;
            finished = false;
            nextWaveAt = -1f;
            if (player != null) player.Vitality.Configure(tuning.playerHealth);
            SpawnWave();
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
                enemy.target = player.transform;
                enemy.tuning = tuning;
                enemies.Add(enemy);
            }
        }
        private void OnGUI()
        {
            if (player == null) return;
            GUIStyle title = new GUIStyle(GUI.skin.label) { fontSize = 20, fontStyle = FontStyle.Bold };
            title.normal.textColor = new Color(.98f, .85f, .64f);
            float width = Mathf.Min(344, Screen.width - 28);
            float content = Mathf.Max(180, width - 32);
            GUI.Box(new Rect(14, 14, width, 140), "");
            GUI.color = new Color(.13f, .17f, .23f);
            GUI.DrawTexture(new Rect(26, 55, content, 4), Texture2D.whiteTexture);
            GUI.color = new Color(.93f, .75f, .48f);
            GUI.DrawTexture(new Rect(26, 55, content * Mathf.Clamp01(player.Vitality.Current / player.Vitality.Maximum), 4), Texture2D.whiteTexture);
            GUI.color = Color.white;
            GUI.Label(new Rect(26, 20, content, 30), "RECREATED  /  THE MIRE", title);
            GUI.Label(new Rect(26, 64, content, 22), "HEALTH   " + Mathf.CeilToInt(player.Vitality.Current) + " / " + player.Vitality.Maximum);
            GUI.Label(new Rect(26, 90, content, 22), finished ? "EXPEDITION CLEARED" : nextWaveAt >= 0f ? "NEXT CHAMBER IN " + Mathf.CeilToInt(nextWaveAt - Time.time) + "s" : "CHAMBER " + CurrentWave + " / " + tuning.wavesPerExpedition + "   •   THREATS " + enemies.Count);
            GUI.Label(new Rect(26, 117, content, 20), "WASD MOVE  •  CLICK ATTACK  •  Q PULSE  •  SHIFT DODGE");
            if ((finished || player.Vitality.IsDead) && GUI.Button(new Rect(14, 164, 180, 38), "RESTART EXPEDITION")) Restart();
        }
    }
}
