using UnityEngine;

namespace Recreated
{
    [RequireComponent(typeof(PlayerController))]
    public sealed class EchoPulseVisual : MonoBehaviour
    {
        public int segments = 48;
        public Color color = new Color(.48f, .81f, 1f, .75f);
        private PlayerController player;
        private LineRenderer ring;
        private void Awake()
        {
            player = GetComponent<PlayerController>();
            GameObject child = new GameObject("Echo Pulse — transient ring");
            child.transform.SetParent(transform, false);
            ring = child.AddComponent<LineRenderer>();
            ring.useWorldSpace = false;
            ring.loop = true;
            ring.positionCount = Mathf.Clamp(segments, 16, 96);
            ring.widthMultiplier = .09f;
            ring.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            ring.receiveShadows = false;
            Shader shader = Shader.Find("Sprites/Default");
            if (shader != null) ring.material = new Material(shader);
            ring.startColor = color;
            ring.endColor = color;
            ring.enabled = false;
        }
        private void LateUpdate()
        {
            float t = player.PulseAnimation01;
            ring.enabled = t < 1f;
            if (!ring.enabled) return;
            float radius = Mathf.Lerp(.5f, player.tuning.pulseRadius, t);
            ring.widthMultiplier = .15f * (1f - t);
            Color tint = color;
            tint.a *= 1f - t;
            ring.startColor = tint;
            ring.endColor = tint;
            for (int i = 0; i < ring.positionCount; i++)
            {
                float angle = i * Mathf.PI * 2f / ring.positionCount;
                ring.SetPosition(i, new Vector3(Mathf.Cos(angle) * radius, -.85f, Mathf.Sin(angle) * radius));
            }
        }
        private void OnDestroy()
        {
            if (ring != null && ring.material != null) Destroy(ring.material);
        }
    }
}
