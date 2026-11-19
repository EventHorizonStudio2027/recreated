using UnityEngine;

namespace Recreated
{
    [RequireComponent(typeof(Health))]
    public sealed class EnemyController : MonoBehaviour
    {
        public Transform target;
        public GameTuning tuning = new GameTuning();
        public Health Vitality { get; private set; }
        private float nextStrike;
        private void Awake()
        {
            tuning.Validate();
            Vitality = GetComponent<Health>();
            Vitality.Configure(tuning.enemyHealth);
            Vitality.Died += _ => Destroy(gameObject);
        }
        private void Update()
        {
            if (target == null || Vitality.IsDead) return;
            Vector3 delta = target.position - transform.position;
            delta.y = 0;
            if (delta.sqrMagnitude > 2.25f)
            {
                Vector3 direction = delta.normalized;
                transform.position += direction * tuning.enemySpeed * Time.deltaTime;
                transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(direction), Time.deltaTime * 9f);
            }
            else if (Time.time >= nextStrike)
            {
                nextStrike = Time.time + tuning.enemyAttackCooldown;
                Health player = target.GetComponent<Health>();
                if (player != null) player.Damage(tuning.enemyDamage);
            }
        }
    }
}
