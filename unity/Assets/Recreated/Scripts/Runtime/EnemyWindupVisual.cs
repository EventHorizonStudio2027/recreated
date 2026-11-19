using UnityEngine;

namespace Recreated
{
    [RequireComponent(typeof(EnemyController))]
    public sealed class EnemyWindupVisual : MonoBehaviour
    {
        private EnemyController enemy;
        private Transform eyes;
        private Vector3 restScale;
        private void Awake()
        {
            enemy = GetComponent<EnemyController>();
            eyes = transform.Find("Shade — luminous eyes");
            if (eyes != null) restScale = eyes.localScale;
        }
        private void LateUpdate()
        {
            if (eyes == null) return;
            float intensity = enemy.IsWindingUp ? 1.6f + Mathf.Sin(Time.time * 28f) * .2f : 1f;
            eyes.localScale = Vector3.Lerp(eyes.localScale, restScale * intensity, Time.deltaTime * 20f);
        }
    }
}
