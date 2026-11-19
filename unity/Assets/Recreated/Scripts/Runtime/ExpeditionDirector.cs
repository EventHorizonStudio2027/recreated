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
                player.Vitality.Heal(player.Vitality.Maximum * .12f);
                SpawnWave();
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
                renderer.material.color = new Color(.44f, .29f, .62f);
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
            GUI.Box(new Rect(14, 14, 330, 120), "");
            GUI.Label(new Rect(26, 20, 300, 30), "RECREATED  /  THE MIRE", title);
            GUI.Label(new Rect(26, 53, 300, 22), "HEALTH   " + Mathf.CeilToInt(player.Vitality.Current) + " / " + player.Vitality.Maximum);
            GUI.Label(new Rect(26, 76, 300, 22), finished ? "EXPEDITION CLEARED" : "CHAMBER " + CurrentWave + " / " + tuning.wavesPerExpedition + "   •   THREATS " + enemies.Count);
            GUI.Label(new Rect(26, 100, 300, 20), "WASD MOVE  •  CLICK ATTACK  •  Q PULSE  •  SHIFT DODGE");
            if ((finished || player.Vitality.IsDead) && GUI.Button(new Rect(14, 146, 180, 38), "RESTART EXPEDITION")) Restart();
        }
    }
}
