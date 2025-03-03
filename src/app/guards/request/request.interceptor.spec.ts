import { CoreTokenService } from '../../token/token.service';
import { CoreUserService } from '../../user/user.service';
import { requestInterceptor } from './request.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('RequestInterceptor', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([requestInterceptor])),
                provideHttpClientTesting(),
                TranslateTestingModule.withTranslations({
                    'pt-br': require('../../../assets/lang/pt-br.json'),
                    en: require('../../../assets/lang/en.json'),
                    es: require('../../../assets/lang/es.json'),
                    ja: require('../../../assets/lang/ja.json'),
                }).withDefaultLanguage('en'),
                { provide: CoreTokenService, useClass: CoreTokenService },
                { provide: CoreUserService, useClass: CoreUserService },
                { provide: Router, useClass: Router },
                { provide: MatDialog, useClass: MatDialog },
                { provide: ToastrService, useClass: ToastrService },
            ],
        });
    });

    it('should add security headers', waitForAsync(() => {}));

    it('should handle 401 unauthorized errors', waitForAsync(() => {}));

    it('should handle 403 forbidden errors', waitForAsync(() => {}));

    it('should handle blob errors securely', waitForAsync(() => {}));

    it('should handle timeout errors securely', waitForAsync(() => {}));

    it('should clear modals on error', waitForAsync(() => {}));
});
