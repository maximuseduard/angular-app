import { MaintenanceGuard } from './maintenance.guard';
import { Router } from '@angular/router';
import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator/jest';
import { asyncError } from '@shared/helpers/async-observable-helpers';
import { UserService } from '@shared/services/user/user.service';
import { Observable, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const generateRouteMock = (url = '/', queryParams = { queryParams: {} }) => ({ route: <any>queryParams, routeState: <any>{ url } });

const userServiceMock = {
    healthCheck: () => of(null),
};

class MockRouter {
    navigate() {}
}

const originalConsoleError = console.error;

describe('MaintenanceGuard', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation();
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    let spectator: SpectatorService<MaintenanceGuard>;
    const createService = createServiceFactory({
        service: MaintenanceGuard,
        providers: [{ provide: Router, useClass: MockRouter }, mockProvider(UserService, userServiceMock)],
    });

    beforeEach(() => (spectator = createService()));

    describe('In maintenance', () => {
        it('should return "true" and do not redirect when in maintenance route and platform is under maintenance', (done) => {
            // Arrange
            const routerService = spectator.inject(Router);

            const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();

            spectator.service.platformUnderMaintenance = true;

            const { route, routeState } = generateRouteMock('/maintenance');

            // Act
            const canActivate: Observable<boolean> = spectator.service.canActivate(route, routeState);

            // Assert
            canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                expect(routerNavigateSpy).toHaveBeenCalledTimes(0);

                expect(boolean).toBeTruthy();
                done();
            });
        });

        it('should return "false" and redirect when not in maintenance route and platform is under maintenance', (done) => {
            // Arrange
            const routerService = spectator.inject(Router);

            const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();

            spectator.service.platformUnderMaintenance = true;

            const { route, routeState } = generateRouteMock('/home');

            // Act
            const canActivate: Observable<boolean> = spectator.service.canActivate(route, routeState);

            // Assert
            canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
                expect(routerNavigateSpy).toHaveBeenCalledWith(['/maintenance']);

                expect(boolean).toBeFalsy();
                done();
            });
        });
    });

    describe('Not in maintenance', () => {
        describe('Inside maintenance route', () => {
            it('should return "true" and redirect to home when in maintenance route, platform is not under maintenance and API is working', (done) => {
                // Arrange
                const userService = spectator.inject(UserService);
                const routerService = spectator.inject(Router);

                const userServiceHealthCheckSpy = jest.spyOn(userService, 'healthCheck').mockReturnValue(of(null));
                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();

                spectator.service.platformUnderMaintenance = false;

                const { route, routeState } = generateRouteMock('/maintenance');

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(route, routeState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(userServiceHealthCheckSpy).toHaveBeenCalledTimes(1);

                    expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
                    expect(routerNavigateSpy).toHaveBeenCalledWith(['/']);

                    expect(boolean).toBeTruthy();
                    done();
                });
            });

            it('should return "false" and redirect to maintenance when in maintenance route, platform is not under maintenance and API is not working', (done) => {
                // Arrange
                const userService = spectator.inject(UserService);
                const routerService = spectator.inject(Router);

                const userServiceHealthCheckSpy = jest.spyOn(userService, 'healthCheck').mockReturnValue(asyncError());
                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();

                spectator.service.platformUnderMaintenance = false;

                const { route, routeState } = generateRouteMock('/maintenance');

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(route, routeState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(userServiceHealthCheckSpy).toHaveBeenCalledTimes(1);

                    expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
                    expect(routerNavigateSpy).toHaveBeenCalledWith(['/maintenance']);

                    expect(boolean).toBeFalsy();
                    done();
                });
            });
        });

        it('should return "true" and do not redirect when not in maintenance route and platform is not under maintenance', (done) => {
            // Arrange
            const routerService = spectator.inject(Router);

            const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();

            spectator.service.platformUnderMaintenance = false;

            const { route, routeState } = generateRouteMock('/home');

            // Act
            const canActivate: Observable<boolean> = spectator.service.canActivate(route, routeState);

            // Assert
            canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                expect(routerNavigateSpy).toHaveBeenCalledTimes(0);

                expect(boolean).toBeTruthy();
                done();
            });
        });
    });
});
