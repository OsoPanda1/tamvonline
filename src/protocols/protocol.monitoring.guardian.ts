// ═══════════════════════════════════════════════════════════════
// TAMV MD-X4™ — PROTOCOL MONITORING GUARDIAN
// Sistema de observación y alerta de protocolos civilizatorios
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// TIPOS DE ESTADO DEL PROTOCOLO
// ═══════════════════════════════════════════════════════════════

export type ProtocolState = 
  | "idle"
  | "arming"
  | "active"
  | "contained"
  | "recovering"
  | "terminated";

export type GuardianVisualLevel = 
  | "calm"
  | "attention"
  | "alert"
  | "critical";

export type ThreatLevel = 
  | "none"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AuthorityType = 
  | "system"
  | "guardian"
  | "eoct"
  | "isabella";

// ═══════════════════════════════════════════════════════════════
// EVENTO OBSERVABLE DEL GUARDIÁN
// ═══════════════════════════════════════════════════════════════

export interface GuardianObservableEvent {
  protocolId: string;
  protocolName: string;
  state: ProtocolState;
  previousState?: ProtocolState;
  threatLevel: ThreatLevel;
  authority: AuthorityType;
  visual: {
    level: GuardianVisualLevel;
    priority: number; // 1-10
  };
  msrBlockIndex?: number;
  bookpiAnchorId?: string;
  ts: number;
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════
// ALERTA DEL GUARDIÁN
// ═══════════════════════════════════════════════════════════════

export interface GuardianAlert {
  id: string;
  protocolId: string;
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: number;
}

// ═══════════════════════════════════════════════════════════════
// ESTADO INTERNO DEL GUARDIÁN
// ═══════════════════════════════════════════════════════════════

export type GuardianState = 
  | "observing"
  | "degraded"
  | "disconnected";

export interface GuardianStatus {
  state: GuardianState;
  activeProtocols: number;
  pendingAlerts: number;
  lastHeartbeat: number;
  uptime: number;
}

// ═══════════════════════════════════════════════════════════════
// CLASE GUARDIAN — MONITOR DE PROTOCOLOS
// ═══════════════════════════════════════════════════════════════

type EventCallback = (event: GuardianObservableEvent) => void;
type AlertCallback = (alert: GuardianAlert) => void;

export class ProtocolMonitoringGuardian {
  private state: GuardianState = "observing";
  private protocols: Map<string, GuardianObservableEvent> = new Map();
  private alerts: GuardianAlert[] = [];
  private eventListeners: Set<EventCallback> = new Set();
  private alertListeners: Set<AlertCallback> = new Set();
  private startTime: number = Date.now();

  constructor() {
    // Heartbeat cada 30 segundos
    setInterval(() => this.heartbeat(), 30000);
  }

  // ═══════════════════════════════════════════════════════════════
  // OBSERVACIÓN DE EVENTOS
  // ═══════════════════════════════════════════════════════════════

  public observe(event: GuardianObservableEvent): void {
    const previousEvent = this.protocols.get(event.protocolId);
    
    // Detectar cambio de estado
    if (previousEvent && previousEvent.state !== event.state) {
      event.previousState = previousEvent.state;
      
      // Generar alerta si es escalación
      if (this.isEscalation(previousEvent.state, event.state)) {
        this.createAlert(event, "warning", 
          `Protocolo ${event.protocolName} escaló de ${previousEvent.state} a ${event.state}`);
      }
    }

    // Alerta crítica
    if (event.visual.level === "critical") {
      this.createAlert(event, "critical",
        `CRÍTICO: ${event.protocolName} requiere atención inmediata`);
    }

    this.protocols.set(event.protocolId, event);
    
    // Notificar a todos los listeners
    this.eventListeners.forEach(listener => listener(event));
  }

  // ═══════════════════════════════════════════════════════════════
  // GESTIÓN DE ALERTAS
  // ═══════════════════════════════════════════════════════════════

  private createAlert(
    event: GuardianObservableEvent, 
    severity: GuardianAlert["severity"],
    message: string
  ): GuardianAlert {
    const alert: GuardianAlert = {
      id: `alert_${event.protocolId}_${Date.now()}`,
      protocolId: event.protocolId,
      severity,
      message,
      timestamp: Date.now(),
      acknowledged: false,
    };

    this.alerts.push(alert);
    
    // Mantener máximo 100 alertas
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Notificar
    this.alertListeners.forEach(listener => listener(alert));

    return alert;
  }

  public acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return false;

    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = Date.now();
    return true;
  }

  public getPendingAlerts(): GuardianAlert[] {
    return this.alerts.filter(a => !a.acknowledged);
  }

  public getAllAlerts(): GuardianAlert[] {
    return [...this.alerts];
  }

  // ═══════════════════════════════════════════════════════════════
  // SUSCRIPCIÓN A EVENTOS
  // ═══════════════════════════════════════════════════════════════

  public onEvent(callback: EventCallback): () => void {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }

  public onAlert(callback: AlertCallback): () => void {
    this.alertListeners.add(callback);
    return () => this.alertListeners.delete(callback);
  }

  // ═══════════════════════════════════════════════════════════════
  // ESTADO DEL SISTEMA
  // ═══════════════════════════════════════════════════════════════

  public getStatus(): GuardianStatus {
    return {
      state: this.state,
      activeProtocols: this.protocols.size,
      pendingAlerts: this.getPendingAlerts().length,
      lastHeartbeat: Date.now(),
      uptime: Date.now() - this.startTime,
    };
  }

  public getProtocolState(protocolId: string): GuardianObservableEvent | undefined {
    return this.protocols.get(protocolId);
  }

  public getAllProtocolStates(): GuardianObservableEvent[] {
    return Array.from(this.protocols.values());
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILIDADES INTERNAS
  // ═══════════════════════════════════════════════════════════════

  private isEscalation(from: ProtocolState, to: ProtocolState): boolean {
    const stateOrder: ProtocolState[] = [
      "idle",
      "recovering",
      "contained",
      "arming",
      "active",
    ];
    
    return stateOrder.indexOf(to) > stateOrder.indexOf(from);
  }

  private heartbeat(): void {
    const now = Date.now();
    
    // Verificar protocolos sin actualización en 5 minutos
    this.protocols.forEach((event, protocolId) => {
      if (now - event.ts > 5 * 60 * 1000) {
        if (event.state !== "idle" && event.state !== "terminated") {
          this.createAlert(event, "warning",
            `Protocolo ${event.protocolName} sin actualización por 5+ minutos`);
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // CREAR EVENTO DE PRUEBA
  // ═══════════════════════════════════════════════════════════════

  public static createTestEvent(
    protocolId: string,
    state: ProtocolState = "idle",
    threatLevel: ThreatLevel = "none"
  ): GuardianObservableEvent {
    const visualLevel: GuardianVisualLevel = 
      threatLevel === "critical" ? "critical" :
      threatLevel === "high" ? "alert" :
      threatLevel === "medium" ? "attention" :
      "calm";

    return {
      protocolId,
      protocolName: `Protocolo ${protocolId}`,
      state,
      threatLevel,
      authority: "system",
      visual: {
        level: visualLevel,
        priority: threatLevel === "critical" ? 10 : threatLevel === "high" ? 7 : 3,
      },
      ts: Date.now(),
    };
  }
}

// Singleton del Guardian
export const protocolGuardian = new ProtocolMonitoringGuardian();
