import {createRequire} from 'module'
/** cjs to  es*/
export default function require(modulePath) {
    return createRequire(import.meta.url)(modulePath);
}
