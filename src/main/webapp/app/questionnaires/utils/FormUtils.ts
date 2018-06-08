import {FormGroup} from '@angular/forms';

export class FormUtils {
    static formToMap<V>(formGroup: FormGroup): Map<string, V> {
        const m: Map<string, V> = new Map<string, V>();
        const formData = formGroup.value;

        Object.keys(formData).forEach((key: string) => {
            m.set(key, formData[key] as V);
        });

        return m;
    }
}