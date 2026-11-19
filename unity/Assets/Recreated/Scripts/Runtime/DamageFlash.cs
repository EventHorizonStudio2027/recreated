using UnityEngine;

namespace Recreated
{
    [RequireComponent(typeof(Health))]
    public sealed class DamageFlash : MonoBehaviour
    {
        public float flashDuration = .13f;
        public Color hitColor = new Color(1f, .4f, .26f);
        private Health health;
        private Renderer[] renderers;
        private MaterialPropertyBlock block;
        private float flashEnds;
        private void Awake()
        {
            health = GetComponent<Health>();
            renderers = GetComponentsInChildren<Renderer>();
            block = new MaterialPropertyBlock();
        }
        private void OnEnable() => health.Damaged += OnDamaged;
        private void OnDisable()
        {
            if (health != null) health.Damaged -= OnDamaged;
            Restore();
        }
        private void OnDamaged(Health source, float amount) => flashEnds = Time.time + flashDuration;
        private void LateUpdate()
        {
            if (renderers == null) return;
            bool flashing = Time.time < flashEnds;
            foreach (Renderer renderer in renderers)
            {
                if (renderer == null) continue;
                renderer.GetPropertyBlock(block);
                if (flashing)
                {
                    block.SetColor("_BaseColor", hitColor);
                    block.SetColor("_Color", hitColor);
                }
                else
                {
                    block.Clear();
                }
                renderer.SetPropertyBlock(block);
            }
        }
        private void Restore()
        {
            if (renderers == null) return;
            foreach (Renderer renderer in renderers)
                if (renderer != null) renderer.SetPropertyBlock(null);
        }
    }
}
