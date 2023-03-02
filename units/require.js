import {createRequire} from 'module'
export default function require(modulePath) {
    return createRequire(import.meta.url)(modulePath);
}
