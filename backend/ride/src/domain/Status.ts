import Ride from './Ride';

export default abstract class Status {
  abstract value: string;

  constructor(readonly ride: Ride) {}

  abstract request(): void;
  abstract accept(): void;
  abstract start(): void;
  abstract finish(): void;
  abstract cancel(): void;
}

export class RequestedStatus extends Status {
  value: string;
  
  constructor(ride: Ride) {
    super(ride);
    this.value = "requested";
  }
  
  request(): void {
    throw new Error('Invalid Status');
  }
  
  accept(): void {
    this.ride.status = new AcceptedStatus(this.ride);
  }
  
  start(): void {
    throw new Error('Invalid Status');
  }
  
  finish(): void {
    throw new Error('Invalid Status');
  }

  cancel(): void {
    this.ride.status = new CancelledStatus(this.ride);
  }
}

export class AcceptedStatus extends Status {
  value: string;
  
  constructor(ride: Ride) {
    super(ride);
    this.value = "accepted";
  }
  
  request(): void {
    throw new Error('Invalid Status');
  }
  
  accept(): void {
    throw new Error('Invalid Status');
  }
  
  start(): void {
    this.ride.status = new InProgressStatus(this.ride);
  }
  
  finish(): void {
    throw new Error('Invalid Status');
  }

  cancel(): void {
    this.ride.status = new CancelledStatus(this.ride);
  }
}

export class InProgressStatus extends Status {
  value: string;
  
  constructor(ride: Ride) {
    super(ride);
    this.value = "in_progress";
  }
  
  request(): void {
    throw new Error('Invalid Status');
  }
  
  accept(): void {
    throw new Error('Invalid Status');
  }
  
  start(): void {
    throw new Error('Invalid Status');
  }
  
  finish(): void {
    this.ride.status = new CompletedStatus(this.ride);
  }
  
  cancel(): void {
    throw new Error('Invalid Status');
  }
}

export class CompletedStatus extends Status {
  value: string;
  
  constructor(ride: Ride) {
    super(ride);
    this.value = "completed";
  }
  
  request(): void {
    throw new Error('Invalid Status');
  }
  
  accept(): void {
    throw new Error('Invalid Status');
  }
  
  start(): void {
    throw new Error('Invalid Status');
  }
  
  finish(): void {
    throw new Error('Invalid Status');
  }

  cancel(): void {
    throw new Error('Invalid Status');
  }
}

export class CancelledStatus extends Status {
  value: string;
  
  constructor(ride: Ride) {
    super(ride);
    this.value = "cancelled";
  }
  
  request(): void {
    throw new Error('Invalid Status');
  }
  
  accept(): void {
    throw new Error('Invalid Status');
  }
  
  start(): void {
    throw new Error('Invalid Status');
  }
  
  finish(): void {
    throw new Error('Invalid Status');
  }

  cancel(): void {
    throw new Error('Invalid Status');
  }
}


export class StatusFactory {
  static create(ride: Ride, status: string) {
    if(status === "requested") return new RequestedStatus(ride);
    if(status === "accepted") return new AcceptedStatus(ride);
    if(status === "in_progress") return new InProgressStatus(ride);
    if(status === "completed") return new CompletedStatus(ride);
    throw new Error('Invalid Status')
  }
}