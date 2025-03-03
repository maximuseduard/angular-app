import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private _behaviorSubjectChannels: {
    [key: string]: BehaviorSubject<any>;
  } = {};

  behaviorCall<EventType>(topic: string, data: EventType | null = null): void {
    if (!this._behaviorSubjectChannels[topic]) {
      this._behaviorSubjectChannels[topic] =
        new BehaviorSubject<EventType | null>(data);
    } else {
      this._behaviorSubjectChannels[topic].next(data);
    }
  }

  behaviorDestroy(topic: string): void {
    const subject = this._behaviorSubjectChannels[topic];

    if (!subject) return;

    subject.complete();

    delete this._behaviorSubjectChannels[topic];
  }

  behaviorListen<EventType>(topic: string): Observable<EventType | null> {
    if (!this._behaviorSubjectChannels[topic]) {
      this._behaviorSubjectChannels[topic] =
        new BehaviorSubject<EventType | null>(null);
    }

    return this._behaviorSubjectChannels[
      topic
    ].asObservable() as Observable<EventType | null>;
  }
}
