export interface Metadata {
  name: string
  namespace: string
  labels?: string[]
  annotations?: string[]
}

interface Selector {
  namespaces: string[]
  labelSelectors?: string[]
  annotationSelectors?: string[]
  phaseSelectors?: string[]
  pods?: string[]
}

export interface Scope {
  selector: Selector
  mode: string
  value?: string
}

export interface AWS {
  action: 'ec2-stop' | 'ec2-restart' | 'detach-volume'
  secretName: string
  awsRegion: string
  ec2Instance: string
  volumeID?: string
  deviceName?: string
}

export interface DNS {
  action: 'error' | 'random'
  patterns: string[]
  containerNames?: string[]
}

export interface GCP {
  action: 'node-stop' | 'node-reset' | 'disk-loss'
  secretName: string
  project: string
  zone: string
  instance: string
  deviceNames?: string[]
}

export interface IO {
  action: 'latency' | 'fault' | 'attrOverride'
  delay?: string
  errno?: number
  attr?: object | string[]
  volumePath: string
  path: string
  percent: number
  methods: string[]
}

export interface Frame {
  funcname: string
  parameters: string
  predicate: string
}

export interface FailKernelReq {
  callchain: Frame[]
  failtype: number
  headers: string[]
  probability: number
  times: number
}

export interface Kernel {
  failKernRequest: FailKernelReq
}

export interface NetworkLoss {
  loss: string
  correlation: string
}

export interface NetworkDelay {
  latency: string
  jitter: string
  correlation: string
}

export interface NetworkDuplicate {
  duplicate: string
  correlation: string
}

export interface NetworkCorrupt {
  corrupt: string
  correlation: string
}

export interface NetworkBandwidth {
  rate: string
  limit: number
  buffer: number
  minburst: number
  peakrate: number
}

export interface Network {
  action: 'partition' | 'loss' | 'delay' | 'duplicate' | 'corrupt' | 'bandwidth'
  loss?: NetworkLoss
  delay?: NetworkDelay
  duplicate?: NetworkDuplicate
  corrupt?: NetworkCorrupt
  bandwidth?: NetworkBandwidth
  direction?: 'from' | 'to' | 'both'
  target?: Selector
}

export interface Pod {
  action: 'pod-failure' | 'pod-kill' | 'container-kill'
  containerNames?: string[]
}

export interface Stress {
  stressors: {
    cpu?: {
      workers: number
      load: number
      options: string[]
    }
    memory?: {
      workers: number
      size: string
      options: string[]
    }
  }
  stressngStressors: string
  containerNames: string
}

export interface Time {
  timeOffset: string
  clockIds: string[]
  containerNames: string[]
}

export interface ExperimentType {
  AWSChaos: AWS
  DNSChaos: DNS
  GCPChaos: GCP
  HTTPChaos?: unknown
  IOChaos: IO
  JVMChaos?: unknown
  KernelChaos: Kernel
  NetworkChaos: Network
  PodChaos: Pod
  StressChaos: Stress
  TimeChaos: Time
  PhysicalMachineChaos?: unknown
}

export type ExperimentKind = keyof ExperimentType

export interface Experiment<K extends ExperimentKind> {
  metadata: Metadata
  spec: Scope &
    ExperimentType[K] & {
      duration?: string
    }
}
