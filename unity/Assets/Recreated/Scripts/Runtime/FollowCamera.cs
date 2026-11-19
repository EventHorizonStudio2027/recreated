using UnityEngine;

namespace Recreated
{
    public sealed class FollowCamera : MonoBehaviour
    {
        public Transform target;
        public Vector3 offset = new Vector3(0, 21, -18);
        public float smoothTime = .15f;
        private Vector3 velocity;
        private Health trackedHealth;
        private float shakeUntil;
        private float shakeStrength;
        private void OnEnable()
        {
            trackedHealth = target != null ? target.GetComponent<Health>() : null;
            if (trackedHealth != null) trackedHealth.Damaged += OnTargetDamaged;
        }
        private void OnDisable()
        {
            if (trackedHealth != null) trackedHealth.Damaged -= OnTargetDamaged;
        }
        private void OnTargetDamaged(Health source, float amount)
        {
            shakeUntil = Time.time + .18f;
            shakeStrength = Mathf.Clamp(amount * .012f, .05f, .24f);
        }
        private void LateUpdate()
        {
            if (target == null) return;
            if (trackedHealth == null || trackedHealth.transform != target)
            {
                if (trackedHealth != null) trackedHealth.Damaged -= OnTargetDamaged;
                trackedHealth = target.GetComponent<Health>();
                if (trackedHealth != null) trackedHealth.Damaged += OnTargetDamaged;
            }
            Vector3 desired = target.position + offset;
            if (Time.time < shakeUntil)
            {
                float fade = Mathf.Clamp01((shakeUntil - Time.time) / .18f);
                desired += new Vector3(Mathf.Sin(Time.time * 97f), 0, Mathf.Cos(Time.time * 113f)) * (shakeStrength * fade);
            }
            transform.position = Vector3.SmoothDamp(transform.position, desired, ref velocity, smoothTime);
        }
    }
}
