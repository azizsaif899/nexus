/**
 * @file core_loader.js
 * @description
 * المحرك الأساسي لنظام AzizSys. يوفر نظام تعريف وحدات (defineModule) وحقن تبعيات (Injector)
 * مستقل تمامًا عن بيئة Google Apps Script.
 */

function initializeAzizSys() {
    const AzizSys = {
        _moduleFactories: new Map(),
        _moduleExports: new Map(),

        /**
         * يعرف وحدة جديدة في النظام.
         * @param {string} name - الاسم الكامل للوحدة (e.g., 'System.Utils').
         * @param {function(object): object} factory - دالة التصنيع التي تستقبل التبعيات وتعيد الوحدة.
         */
        defineModule(name, factory) {
            if (typeof name !== 'string' || !name) {
                throw new Error('Module name must be a non-empty string.');
            }
            if (typeof factory !== 'function') {
                throw new Error(`Factory for module '${name}' must be a function.`);
            }
            console.log(`[Loader] Defining module: ${name}`);
            this._moduleFactories.set(name, factory);
        },

        /**
         * (Helper for Node.js environment)
         * Loads and defines a module from a file path.
         * This is a simplified version for the runner.
         */
        defineModuleFromPath(filePath) {
            // In a real Node.js app, this would use `require(filePath)`.
            // Here, we simulate it by assuming the file content is available.
            // This part is conceptual for the runner's purpose.
            // For this simulation, we'll just log it.
            console.log(`[Loader] Conceptual load from path: ${filePath}`);
        },

        Injector: {
            _resolving: new Set(),

            /**
             * يجلب وحدة أو أكثر من النظام، مع حل تبعياتها.
             * @param {...string} names - أسماء الوحدات المطلوبة.
             * @returns {object} كائن يحتوي على الوحدات المطلوبة.
             */
            get(...names) {
                const resolved = {};
                for (const name of names) {
                    if (!AzizSys._moduleFactories.has(name) && !AzizSys._moduleExports.has(name)) {
                         // In a real scenario, you might try to dynamically load it here.
                         console.warn(`[Injector] Warning: Module '${name}' is not defined.`);
                    }
                    resolved[name] = this._resolve(name);
                }
                return resolved;
            },

            _resolve(name) {
                // 1. Check if already resolved and cached
                if (AzizSys._moduleExports.has(name)) {
                    return AzizSys._moduleExports.get(name);
                }

                // 2. Check for circular dependencies
                if (this._resolving.has(name)) {
                    throw new Error(`Circular dependency detected: ${[...this._resolving, name].join(' -> ')}`);
                }

                // 3. Get the factory
                const factory = AzizSys._moduleFactories.get(name);
                if (!factory) {
                    throw new Error(`Module '${name}' not found.`);
                }

                this._resolving.add(name);

                // 4. Resolve dependencies for the factory
                const fnStr = factory.toString();
                const match = fnStr.match(/^(?:function|\()?\s*\(?([^)]*)\)?/);
                const depNames = match ? (match[1] || '').replace(/\{|\}/g, '').split(',').map(s => s.trim()).filter(Boolean) : [];
                const dependencies = this.get(...depNames);

                // 5. Create and cache the module instance
                const moduleInstance = factory(dependencies);
                AzizSys._moduleExports.set(name, moduleInstance);

                this._resolving.delete(name);

                console.log(`[Injector] ✅ Module '${name}' resolved successfully.`);
                return moduleInstance;
            }
        }
    };

    return AzizSys;
}