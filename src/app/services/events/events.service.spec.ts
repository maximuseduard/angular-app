import { EventService } from './events.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

describe('EventService', () => {
    let spectator: SpectatorService<EventService>;

    const createService = createServiceFactory({ service: EventService });

    beforeEach(() => {
        spectator = createService();
    });

    const key = 'TEST';

    describe('Behavior subject', () => {
        describe('Function: behaviorDestroy', () => {
            it('should not destroy behavior if no behavior', () => {
                // Act
                spectator.service.behaviorDestroy(key);

                // Assert
                expect(spectator.service['_behaviorSubjectChannels'][key]).toBeUndefined();
            });

            it('should destroy behavior if no behavior', () => {
                // Arrange
                spectator.service.behaviorListen(key);

                expect(spectator.service['_behaviorSubjectChannels'][key]).toBeDefined();

                // Act
                spectator.service.behaviorDestroy(key);

                // Assert
                expect(spectator.service['_behaviorSubjectChannels'][key]).toBeUndefined();
            });
        });

        describe('Function: behaviorListen', () => {
            it('should listen an empty behavior', (done) => {
                // Act
                const listener = spectator.service.behaviorListen(key);

                // Assert
                listener.subscribe((result) => {
                    expect(result).toBeNull();

                    done();
                });
            });
        });

        describe('Function: behaviorCall', () => {
            it('should listen behavior and be truthy', (done) => {
                // Arrange
                spectator.service.behaviorCall(key, true);

                // Act
                const listener = spectator.service.behaviorListen<boolean>(key);

                // Assert
                listener.subscribe((result) => {
                    expect(result).toBeTruthy();

                    done();
                });
            });

            it('should listen behavior and be falsy', (done) => {
                // Arrange
                spectator.service.behaviorCall(key);

                // Act
                const listener = spectator.service.behaviorListen<boolean>(key);

                spectator.service.behaviorCall(key, false);

                // Assert
                listener.subscribe((result) => {
                    expect(result).toBeFalsy();

                    done();
                });
            });
        });
    });

    describe('Subject', () => {
        describe('Function: destroy', () => {
            it('should not destroy behavior if no behavior', () => {
                // Act
                spectator.service.destroy(key);

                // Assert
                expect(spectator.service['_subjectChannels'][key]).toBeUndefined();
            });

            it('should destroy behavior if no behavior', () => {
                // Arrange
                spectator.service.subscribe(key, () => {});

                expect(spectator.service['_subjectChannels'][key]).toBeDefined();

                // Act
                spectator.service.destroy(key);

                // Assert
                expect(spectator.service['_subjectChannels'][key]).toBeUndefined();
            });
        });

        describe('Function: publish', () => {});

        describe('Function: subscribe', () => {});

        describe('Function: unsubscribe', () => {});
    });
});
