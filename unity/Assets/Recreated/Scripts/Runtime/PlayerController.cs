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
        private float verticalSpeed;
        private float lastAimInputAt = -999f;
        private float lastAttackAt = -999f;
        private float lastPulseAt = -999f;
        public float AttackAnimation01 => Mathf.Clamp01((Time.time - lastAttackAt) / tuning.attackCooldown);
        public float PulseAnimation01 => Mathf.Clamp01((Time.time - lastPulseAt) / .42f);
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
        public void ResetForExpedition(Vector3 spawnPosition)
        {
            nextAttack = nextDodge = nextPulse = dodgeEnd = 0f;
            lastAttackAt = lastPulseAt = -999f;
            verticalSpeed = 0f;
            lastAimInputAt = -999f;
            dodgeDirection = Vector3.zero;
            facing = Vector3.forward;
            bool wasEnabled = motor.enabled;
            motor.enabled = false;
            transform.position = spawnPosition;
            transform.rotation = Quaternion.identity;
            motor.enabled = wasEnabled;
            health.Configure(tuning.playerHealth);
        }

        private void Update()
        {
            if (health.IsDead) return;
            Keyboard keyboard = Keyboard.current;
            Gamepad pad = Gamepad.current;
            if (keyboard == null && pad == null) return;
            float x = keyboard == null ? 0f : (keyboard.dKey.isPressed || keyboard.rightArrowKey.isPressed ? 1f : 0f) - (keyboard.aKey.isPressed || keyboard.leftArrowKey.isPressed ? 1f : 0f);
            float z = keyboard == null ? 0f : (keyboard.wKey.isPressed || keyboard.upArrowKey.isPressed ? 1f : 0f) - (keyboard.sKey.isPressed || keyboard.downArrowKey.isPressed ? 1f : 0f);
            if (pad != null)
            {
                Vector2 stick = pad.leftStick.ReadValue();
                if (stick.sqrMagnitude > .04f) { x = stick.x; z = stick.y; }
                Vector2 aimStick = pad.rightStick.ReadValue();
                if (aimStick.sqrMagnitude > .09f)
                {
                    facing = new Vector3(aimStick.x, 0f, aimStick.y).normalized;
                    lastAimInputAt = Time.unscaledTime;
                }
            }
            Vector3 direction = Vector3.ClampMagnitude(new Vector3(x, 0, z), 1f);
            if (direction.sqrMagnitude > .01f && Time.unscaledTime - lastAimInputAt > .25f) facing = direction.normalized;
            Camera cam = Camera.main;
            if (cam != null && Mouse.current != null && (pad == null || Mouse.current.delta.ReadValue().sqrMagnitude > .01f) && (pad == null || pad.rightStick.ReadValue().sqrMagnitude <= .09f))
            {
                Ray ray = cam.ScreenPointToRay(Mouse.current.position.ReadValue());
                Plane floor = new Plane(Vector3.up, Vector3.zero);
                if (floor.Raycast(ray, out float distance))
                {
                    Vector3 aim = ray.GetPoint(distance) - transform.position;
                    aim.y = 0;
                    if (aim.sqrMagnitude > .2f)
                    {
                        facing = aim.normalized;
                        lastAimInputAt = Time.unscaledTime;
                    }
                }
            }
            transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(facing), Time.deltaTime * 16f);
            if (((keyboard != null && keyboard.leftShiftKey.wasPressedThisFrame) || (pad != null && pad.buttonEast.wasPressedThisFrame)) && Time.time >= nextDodge && direction.sqrMagnitude > .01f)
            {
                dodgeDirection = direction.normalized;
                dodgeEnd = Time.time + tuning.dodgeDuration;
                nextDodge = Time.time + tuning.dodgeCooldown;
            }
            Vector3 velocity = Time.time < dodgeEnd ? dodgeDirection * tuning.dodgeSpeed : direction * tuning.moveSpeed;
            verticalSpeed = motor.isGrounded ? -2f : Mathf.Max(-35f, verticalSpeed + Physics.gravity.y * Time.deltaTime);
            motor.Move((velocity + Vector3.up * verticalSpeed) * Time.deltaTime);
            if (((Mouse.current != null && Mouse.current.leftButton.wasPressedThisFrame) || (keyboard != null && keyboard.spaceKey.wasPressedThisFrame) || (pad != null && pad.buttonSouth.wasPressedThisFrame)) && Time.time >= nextAttack)
            {
                nextAttack = Time.time + tuning.attackCooldown;
                lastAttackAt = Time.time;
                HitEnemies(tuning.attackRadius, tuning.attackDamage, true);
            }
            if (((keyboard != null && keyboard.qKey.wasPressedThisFrame) || (pad != null && pad.rightShoulder.wasPressedThisFrame)) && Time.time >= nextPulse)
            {
                nextPulse = Time.time + tuning.pulseCooldown;
                lastPulseAt = Time.time;
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
                if (enemy == null || enemy.Vitality.IsDead || struck.Contains(enemy)) continue;
                Vector3 toEnemy = enemy.transform.position - transform.position;
                toEnemy.y = 0;
                if (directional && Vector3.Dot(facing, toEnemy.normalized) < .2f) continue;
                struck.Add(enemy);
                enemy.Vitality.Damage(damage);
            }
        }
    }
}
