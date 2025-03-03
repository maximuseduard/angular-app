import { RequestDestroyHook } from './request-destroy-hook.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

describe('RequestDestroyHook', () => {
  let spectator: SpectatorService<RequestDestroyHook>;

  const createService = createServiceFactory({ service: RequestDestroyHook });

  beforeEach(() => {
    spectator = createService();
  });

  it('should call with options', () => {
    // Arrange
    const nextSpy = jest
      .spyOn(spectator.service.destroy$, 'next')
      .mockImplementation();
    const completeSpy = jest
      .spyOn(spectator.service.destroy$, 'complete')
      .mockImplementation();

    // Act
    spectator.service.ngOnDestroy();

    // Assert
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});
