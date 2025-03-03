import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CoreUserService } from '@core/user/user.service';
import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator/jest';
import { EventService } from '@shared/services/events/events.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { Observable, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const routeWithComplexParams = { queryParams: { redirectUrl: 'redirect-url?id=10' } } as unknown as ActivatedRouteSnapshot;
const routeWithParams = { queryParams: { redirectUrl: 'redirect-url' } } as unknown as ActivatedRouteSnapshot;
const routeWithoutParams = { queryParams: {} } as ActivatedRouteSnapshot;
const privateRouteState = { url: 'fake-url?id=1' } as RouterStateSnapshot;
const publicRouteState = { url: '/signup' } as RouterStateSnapshot;

class MockRouter {
    navigate() {}
}

const originalConsoleError = console.error;

describe('AuthGuard', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation();
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    let spectator: SpectatorService<AuthGuard>;
    const createService = createServiceFactory({
        service: AuthGuard,
        imports: [
            TranslateTestingModule.withTranslations({
                'pt-br': require('../../../../assets/lang/pt-br.json'),
                en: require('../../../../assets/lang/en.json'),
                es: require('../../../../assets/lang/es.json'),
                ja: require('../../../../assets/lang/ja.json'),
            }).withDefaultLanguage('en'),
        ],
        providers: [
            mockProvider(CoreUserService, {
                logout: () => null,
            }),
            mockProvider(EventService, {
                behaviorListen: () => of(true),
            }),
            mockProvider(ToastrService, {
                info: () => null,
            }),
            { provide: Router, useClass: MockRouter },
        ],
    });

    beforeEach(() => (spectator = createService()));

    it('should return true when user status is not loaded yet', (done) => {
        // Arrange
        const eventService = spectator.inject(EventService);
        const routerService = spectator.inject(Router);
        const toastrService = spectator.inject(ToastrService);

        const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
        const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

        jest.spyOn(eventService, 'behaviorListen').mockImplementationOnce(() => of(null));

        // Act
        const canActivate: Observable<boolean> = spectator.service.canActivateChild(routeWithoutParams, publicRouteState);

        // Assert
        canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
            expect(boolean).toBeTruthy();

            expect(routerNavigateSpy).toHaveBeenCalledTimes(0);
            expect(toastInfoSpy).toHaveBeenCalledTimes(0);
            done();
        });
    });

    describe('User is logged', () => {
        describe('Public route', () => {
            it('should return false and redirect to home when no redirect URL', (done) => {
                // Arrange
                const eventService = spectator.inject(EventService);
                const routerService = spectator.inject(Router);
                const toastrService = spectator.inject(ToastrService);

                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
                const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

                jest.spyOn(eventService, 'behaviorListen').mockImplementationOnce(() => of(true));

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(routeWithoutParams, publicRouteState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(boolean).toBeFalsy();

                    expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
                    expect(routerNavigateSpy).toHaveBeenCalledWith(['/home']);
                    expect(toastInfoSpy).toHaveBeenCalledTimes(0);
                    done();
                });
            });

            it('should return false and redirect to simple URL', (done) => {
                // Arrange
                const eventService = spectator.inject(EventService);
                const routerService = spectator.inject(Router);
                const toastrService = spectator.inject(ToastrService);

                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
                const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

                jest.spyOn(eventService, 'behaviorListen').mockImplementationOnce(() => of(true));

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(routeWithParams, publicRouteState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(boolean).toBeFalsy();

                    expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
                    expect(routerNavigateSpy).toHaveBeenCalledWith(['redirect-url']);
                    expect(toastInfoSpy).toHaveBeenCalledTimes(0);
                    done();
                });
            });

            it('should return false and redirect to complex URL', (done) => {
                // Arrange
                const eventService = spectator.inject(EventService);
                const routerService = spectator.inject(Router);
                const toastrService = spectator.inject(ToastrService);

                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
                const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

                jest.spyOn(eventService, 'behaviorListen').mockImplementationOnce(() => of(true));

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(routeWithComplexParams, publicRouteState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(boolean).toBeFalsy();

                    expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
                    expect(routerNavigateSpy).toHaveBeenCalledWith(['redirect-url'], { queryParams: { id: '10' } });
                    expect(toastInfoSpy).toHaveBeenCalledTimes(0);
                    done();
                });
            });
        });

        describe('Private route', () => {
            it('should return false and logout when company is inactive and user data is missing', (done) => {
                // Arrange
                const coreUserService = spectator.inject(CoreUserService);
                const eventService = spectator.inject(EventService);
                const routerService = spectator.inject(Router);
                const toastrService = spectator.inject(ToastrService);

                const logoutSpy = jest.spyOn(coreUserService, 'logout');
                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
                const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

                const missingData = true;
                const companyInactive = true;

                jest.spyOn(eventService, 'behaviorListen')
                    .mockImplementationOnce(() => of(true))
                    .mockImplementationOnce(() => of(missingData))
                    .mockImplementationOnce(() => of(companyInactive));

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(routeWithParams, privateRouteState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(boolean).toBeFalsy();

                    expect(logoutSpy).toHaveBeenCalledTimes(1);
                    expect(routerNavigateSpy).toHaveBeenCalledTimes(0);
                    expect(toastInfoSpy).toHaveBeenCalledTimes(1);
                    done();
                });
            });

            it('should return false and request missing data when company is active and user data is missing', (done) => {
                // Arrange
                const coreUserService = spectator.inject(CoreUserService);
                const eventService = spectator.inject(EventService);
                const routerService = spectator.inject(Router);
                const toastrService = spectator.inject(ToastrService);

                const logoutSpy = jest.spyOn(coreUserService, 'logout');
                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
                const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

                const missingData = true;
                const companyInactive = false;

                jest.spyOn(eventService, 'behaviorListen')
                    .mockImplementationOnce(() => of(true))
                    .mockImplementationOnce(() => of(missingData))
                    .mockImplementationOnce(() => of(companyInactive));

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(routeWithParams, privateRouteState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(boolean).toBeFalsy();

                    expect(logoutSpy).toHaveBeenCalledTimes(0);
                    expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
                    expect(routerNavigateSpy).toHaveBeenCalledWith(['/required-data'], { queryParams: { redirectUrl: 'fake-url?id=1' } });
                    expect(toastInfoSpy).toHaveBeenCalledTimes(0);
                    done();
                });
            });

            it('should return false and redirect to home when company is active and user is valid and is in missing data URL and does not have query params', (done) => {
                // Arrange
                const coreUserService = spectator.inject(CoreUserService);
                const eventService = spectator.inject(EventService);
                const routerService = spectator.inject(Router);
                const toastrService = spectator.inject(ToastrService);

                const logoutSpy = jest.spyOn(coreUserService, 'logout');
                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
                const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

                const missingData = false;
                const companyInactive = false;

                jest.spyOn(eventService, 'behaviorListen')
                    .mockImplementationOnce(() => of(true))
                    .mockImplementationOnce(() => of(missingData))
                    .mockImplementationOnce(() => of(companyInactive));

                const routeState = { url: '/required-data' } as RouterStateSnapshot;

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(routeWithoutParams, routeState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(boolean).toBeFalsy();

                    expect(logoutSpy).toHaveBeenCalledTimes(0);
                    expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
                    expect(routerNavigateSpy).toHaveBeenCalledWith(['/home']);
                    expect(toastInfoSpy).toHaveBeenCalledTimes(0);
                    done();
                });
            });

            it('should return false and redirect to params when company is active and user is valid and is in missing data URL and have query params', (done) => {
                // Arrange
                const coreUserService = spectator.inject(CoreUserService);
                const eventService = spectator.inject(EventService);
                const routerService = spectator.inject(Router);
                const toastrService = spectator.inject(ToastrService);

                const logoutSpy = jest.spyOn(coreUserService, 'logout');
                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
                const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

                const missingData = false;
                const companyInactive = false;

                jest.spyOn(eventService, 'behaviorListen')
                    .mockImplementationOnce(() => of(true))
                    .mockImplementationOnce(() => of(missingData))
                    .mockImplementationOnce(() => of(companyInactive));

                const routeState = { url: '/required-data' } as RouterStateSnapshot;

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(routeWithParams, routeState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(boolean).toBeFalsy();

                    expect(logoutSpy).toHaveBeenCalledTimes(0);
                    expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
                    expect(routerNavigateSpy).toHaveBeenCalledWith(['redirect-url']);
                    expect(toastInfoSpy).toHaveBeenCalledTimes(0);
                    done();
                });
            });

            it('should return true when company is active and user is valid', (done) => {
                // Arrange
                const coreUserService = spectator.inject(CoreUserService);
                const eventService = spectator.inject(EventService);
                const routerService = spectator.inject(Router);
                const toastrService = spectator.inject(ToastrService);

                const logoutSpy = jest.spyOn(coreUserService, 'logout');
                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
                const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

                const missingData = false;
                const companyInactive = false;

                jest.spyOn(eventService, 'behaviorListen')
                    .mockImplementationOnce(() => of(true))
                    .mockImplementationOnce(() => of(missingData))
                    .mockImplementationOnce(() => of(companyInactive));

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(routeWithParams, privateRouteState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(boolean).toBeTruthy();

                    expect(logoutSpy).toHaveBeenCalledTimes(0);
                    expect(routerNavigateSpy).toHaveBeenCalledTimes(0);
                    expect(toastInfoSpy).toHaveBeenCalledTimes(0);
                    done();
                });
            });

            it('should return true when company status is not loaded and user status is not loaded', (done) => {
                // Arrange
                const coreUserService = spectator.inject(CoreUserService);
                const eventService = spectator.inject(EventService);
                const routerService = spectator.inject(Router);
                const toastrService = spectator.inject(ToastrService);

                const logoutSpy = jest.spyOn(coreUserService, 'logout');
                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
                const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

                const missingData = null;
                const companyInactive = null;

                jest.spyOn(eventService, 'behaviorListen')
                    .mockImplementationOnce(() => of(true))
                    .mockImplementationOnce(() => of(missingData))
                    .mockImplementationOnce(() => of(companyInactive));

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(routeWithParams, privateRouteState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(boolean).toBeTruthy();

                    expect(logoutSpy).toHaveBeenCalledTimes(0);
                    expect(routerNavigateSpy).toHaveBeenCalledTimes(0);
                    expect(toastInfoSpy).toHaveBeenCalledTimes(0);
                    done();
                });
            });
        });
    });

    describe('User is not logged', () => {
        describe('Public route', () => {
            it('should return true', (done) => {
                // Arrange
                const eventService = spectator.inject(EventService);
                const routerService = spectator.inject(Router);
                const toastrService = spectator.inject(ToastrService);

                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
                const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

                jest.spyOn(eventService, 'behaviorListen').mockImplementationOnce(() => of(false));

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(routeWithoutParams, publicRouteState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(boolean).toBeTruthy();

                    expect(routerNavigateSpy).toHaveBeenCalledTimes(0);
                    expect(toastInfoSpy).toHaveBeenCalledTimes(0);
                    done();
                });
            });
        });

        describe('Private route', () => {
            it('should return false and redirect', (done) => {
                // Arrange
                const eventService = spectator.inject(EventService);
                const routerService = spectator.inject(Router);
                const toastrService = spectator.inject(ToastrService);

                const routerNavigateSpy = jest.spyOn(routerService, 'navigate').mockImplementation();
                const toastInfoSpy = jest.spyOn(toastrService, 'info').mockImplementation();

                jest.spyOn(eventService, 'behaviorListen').mockImplementationOnce(() => of(false));

                // Act
                const canActivate: Observable<boolean> = spectator.service.canActivate(routeWithoutParams, privateRouteState);

                // Assert
                canActivate.pipe(debounceTime(100)).subscribe((boolean) => {
                    expect(boolean).toBeFalsy();

                    expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
                    expect(routerNavigateSpy).toHaveBeenCalledWith(['/signin']);
                    expect(toastInfoSpy).toHaveBeenCalledTimes(0);
                    done();
                });
            });
        });
    });
});
