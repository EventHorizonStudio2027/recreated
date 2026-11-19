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
            Vitality.Died += _ => Destroy(gameObject);
        }
        private void Update()
        {
            if (target == null || Vitality.IsDead) return;
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
                Health player = target.GetComponent<Health>();
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
