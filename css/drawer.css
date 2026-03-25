/* ==========================================================
   DRAWER v2 (Slide-in Panel)
   Right-side panel for SHAP explanation. Enhanced with
   smooth transitions and better visual hierarchy.
   ========================================================== */

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 61, 77, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 90;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.drawer-overlay.is-open { opacity: 1; pointer-events: all; }

.drawer {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 500px;
  max-width: 94vw;
  background: var(--color-card);
  z-index: 100;
  box-shadow: var(--shadow-lg);
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.drawer.is-open { transform: translateX(0); }

/* Header */
.drawer__header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--color-bg-mint), #f0fafa);
}
.drawer__header-info { flex: 1; }
.drawer__title {
  font-size: 1rem;
  font-weight: var(--fw-semibold);
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.drawer__subtitle {
  font-size: 0.73rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}
.drawer__close {
  width: 34px; height: 34px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-card);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  color: var(--color-text-muted);
  transition: all var(--ease);
  flex-shrink: 0;
  margin-left: 12px;
}
.drawer__close:hover {
  background: var(--color-danger-light);
  color: var(--color-danger);
  border-color: var(--color-danger);
}

/* Body */
.drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg) 24px 36px;
}

/* Patient card inside drawer */
.drawer-patient {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: 20px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--color-border-light);
}
.drawer-patient__avatar {
  width: 48px; height: 48px;
  border-radius: var(--radius-full);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem;
  font-weight: var(--fw-bold);
  color: #fff;
  flex-shrink: 0;
  box-shadow: var(--shadow);
}
.drawer-patient__name {
  font-size: 1.1rem;
  font-weight: var(--fw-semibold);
}
.drawer-patient__meta {
  font-size: 0.73rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* Risk summary row */
.drawer-risk {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  padding: 14px 18px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--color-bg), var(--color-border-light));
  border: 1px solid var(--color-border);
}
.drawer-risk__score {
  font-size: 1.8rem;
  font-weight: var(--fw-bold);
  flex-shrink: 0;
}
.drawer-risk__details { flex: 1; }
.drawer-risk__bar {
  height: 8px;
  background: var(--color-border-light);
  border-radius: var(--radius-xs);
  margin-top: var(--space-sm);
  overflow: hidden;
}
.drawer-risk__bar-fill {
  height: 100%;
  border-radius: var(--radius-xs);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Section */
.drawer-section { margin-bottom: 20px; }
.drawer-section__title {
  font-size: 0.84rem;
  font-weight: var(--fw-semibold);
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
}

/* Tags */
.drawer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--space-md);
}
.drawer-tag {
  padding: 4px 12px;
  border-radius: var(--radius-xs);
  font-size: 0.72rem;
  font-weight: var(--fw-medium);
}
.drawer-tag--negative { background: #FFF5F5; color: #C53030; border: 1px solid #FED7D7; }
.drawer-tag--positive { background: #F0FFF4; color: #276749; border: 1px solid #C6F6D5; }

/* Action button */
.drawer-action {
  margin-top: var(--space-sm);
  padding: 14px 20px;
  border-radius: var(--radius-sm);
  background: var(--grad-primary);
  color: #fff;
  text-align: center;
  font-weight: var(--fw-semibold);
  font-size: 0.9rem;
  border: none;
  width: 100%;
  font-family: inherit;
  transition: all var(--ease);
  box-shadow: 0 2px 8px rgba(26,102,122,0.25);
}
.drawer-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(26,102,122,0.35);
}
