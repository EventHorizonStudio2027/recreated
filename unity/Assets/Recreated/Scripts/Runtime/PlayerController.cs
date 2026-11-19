using UnityEngine;
using UnityEngine.InputSystem;
using System.Collections.Generic;

namespace Recreated
{
    [RequireComponent(typeof(CharacterController), typeof(Health))]
    public sealed class PlayerController : MonoBehaviour
    {
        public GameTuning tuning = new GameTuning();
        public LayerMask enemyLayers = ~0;
        private CharacterController motor;
        private Health health;
        private Vector3 facing = Vector3.forward;
        private float nextAttack;
        private float nextDodge;
        private float dodgeEnd;
        private float nextPulse;
        private Vector3 dodgeDirection;
        public Health Vitality => health;
        public float AttackReadyAt => nextAttack;
        public float DodgeReadyAt => nextDodge;
        public float PulseReadyAt => nextPulse;
        public bool IsDodging => Time.time < dodgeEnd;
        public bool CanTakeDamage => !IsDodging && !health.IsDead;

        private void Awake()
        {
            tuning.Validate();
            motor = GetComponent<CharacterController>();
            health = GetComponent<Health>();
            health.Configure(tuning.playerHealth);
            motor.height = 2f;
            motor.center = Vector3.zero;
            motor.radius = .4f;
        }
        private void Update()
        {
            if (health.IsDead) return;
            Keyboard keyboard = Keyboard.current;
            if (keyboard == null) return;
            float x = (keyboard.dKey.isPressed || keyboard.rightArrowKey.isPressed ? 1f : 0f) - (keyboard.aKey.isPressed || keyboard.leftArrowKey.isPressed ? 1f : 0f);
            float z = (keyboard.wKey.isPressed || keyboard.upArrowKey.isPressed ? 1f : 0f) - (keyboard.sKey.isPressed || keyboard.downArrowKey.isPressed ? 1f : 0f);
            Vector3 direction = Vector3.ClampMagnitude(new Vector3(x, 0, z), 1f);
            if (direction.sqrMagnitude > .01f) facing = direction.normalized;
            Camera cam = Camera.main;
            if (cam != null && Mouse.current != null)
            {
                Ray ray = cam.ScreenPointToRay(Mouse.current.position.ReadValue());
                Plane floor = new Plane(Vector3.up, Vector3.zero);
                if (floor.Raycast(ray, out float distance))
                {
                    Vector3 aim = ray.GetPoint(distance) - transform.position;
                    aim.y = 0;
                    if (aim.sqrMagnitude > .2f) facing = aim.normalized;
                }
            }
            transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(facing), Time.deltaTime * 16f);
            if (keyboard.leftShiftKey.wasPressedThisFrame && Time.time >= nextDodge && direction.sqrMagnitude > .01f)
            {
                dodgeDirection = direction.normalized;
                dodgeEnd = Time.time + tuning.dodgeDuration;
                nextDodge = Time.time + tuning.dodgeCooldown;
            }
            Vector3 velocity = Time.time < dodgeEnd ? dodgeDirection * tuning.dodgeSpeed : direction * tuning.moveSpeed;
            motor.Move((velocity + Vector3.down * 1f) * Time.deltaTime);
            if (((Mouse.current != null && Mouse.current.leftButton.wasPressedThisFrame) || keyboard.spaceKey.wasPressedThisFrame) && Time.time >= nextAttack)
            {
                nextAttack = Time.time + tuning.attackCooldown;
                HitEnemies(tuning.attackRadius, tuning.attackDamage, true);
            }
            if (keyboard.qKey.wasPressedThisFrame && Time.time >= nextPulse)
            {
                nextPulse = Time.time + tuning.pulseCooldown;
                HitEnemies(tuning.pulseRadius, tuning.pulseDamage, false);
            }
        }
        private void HitEnemies(float radius, float damage, bool directional)
        {
            Collider[] hits = Physics.OverlapSphere(transform.position, radius, enemyLayers, QueryTriggerInteraction.Ignore);
            HashSet<EnemyController> struck = new HashSet<EnemyController>();
            foreach (Collider hit in hits)
            {
                EnemyController enemy = hit.GetComponentInParent<EnemyController>();
                if (enemy == null || enemy.Vitality.IsDead || !struck.Add(enemy)) continue;
                Vector3 toEnemy = enemy.transform.position - transform.position;
                toEnemy.y = 0;
                if (directional && Vector3.Dot(facing, toEnemy.normalized) < .2f) continue;
                enemy.Vitality.Damage(damage);
            }
        }
    }
}
