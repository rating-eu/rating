import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, MatTabsModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
    imports: [
        CommonModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule
    ],
    exports: [
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class MaterialModule {
}
