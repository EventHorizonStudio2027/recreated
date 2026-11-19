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
        private float staggerUntil;
                public bool IsStaggered => Time.time < staggerUntil;
        private float strafeSign;
        private float orbitOffset;
        private float windupEnds = -1f;
        public bool IsWindingUp => windupEnds >= 0f;
        private void Awake()
        {
            tuning.Validate();
            Vitality = GetComponent<Health>();
            strafeSign = (GetInstanceID() & 1) == 0 ? 1f : -1f;
            orbitOffset = Mathf.Abs(GetInstanceID() % 7) * .31f;
            Vitality.Configure(tuning.enemyHealth);
            Vitality.Damaged += OnDamaged;
            Vitality.Died += _ => Destroy(gameObject);
        }
        public void Configure(Transform followTarget, GameTuning sharedTuning)
        {
            target = followTarget;
            tuning = sharedTuning ?? new GameTuning();
            tuning.Validate();
            Vitality.Configure(tuning.enemyHealth);
        }
        private void OnDamaged(Health source, float amount)
        {
            if (source.IsDead) return;
            windupEnds = -1f;
            staggerUntil = Mathf.Max(staggerUntil, Time.time + .16f);
        }
        private void Update()
        {
            if (target == null || Vitality.IsDead) return;
            if (IsStaggered) return;
            Health targetHealth = target.GetComponent<Health>();
            if (targetHealth == null || targetHealth.IsDead)
            {
                windupEnds = -1f;
                return;
            }
            Vector3 delta = target.position - transform.position;
            delta.y = 0;
            if (delta.sqrMagnitude > 2.25f)
            {
                windupEnds = -1f;
                Vector3 direction = delta.normalized;
                Vector3 tangent = new Vector3(-direction.z, 0, direction.x) * strafeSign;
                float orbit = Mathf.Sin(Time.time * 1.7f + orbitOffset) * .35f;
                Vector3 pursuit = (direction + tangent * orbit).normalized;
                transform.position += pursuit * tuning.enemySpeed * Time.deltaTime;
                transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(direction), Time.deltaTime * 9f);
            }
            else if (windupEnds >= 0f)
            {
                if (Time.time < windupEnds) return;
                windupEnds = -1f;
                nextStrike = Time.time + tuning.enemyAttackCooldown;
                Health player = targetHealth;
                PlayerController controller = target.GetComponent<PlayerController>();
                if (player != null && (controller == null || controller.CanTakeDamage)) player.Damage(tuning.enemyDamage);
            }
            else if (Time.time >= nextStrike)
            {
                windupEnds = Time.time + .42f;
            }
        }
    }
}
