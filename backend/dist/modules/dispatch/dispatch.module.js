"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dispatch_controller_1 = require("./dispatch.controller");
const dispatch_service_1 = require("./dispatch.service");
const dispatch_gateway_1 = require("./dispatch.gateway");
const job_entity_1 = require("../../database/entities/job.entity");
const worker_entity_1 = require("../../database/entities/worker.entity");
const auth_module_1 = require("../auth/auth.module");
let DispatchModule = class DispatchModule {
};
exports.DispatchModule = DispatchModule;
exports.DispatchModule = DispatchModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([job_entity_1.Job, worker_entity_1.Worker]), auth_module_1.AuthModule],
        controllers: [dispatch_controller_1.DispatchController],
        providers: [dispatch_service_1.DispatchService, dispatch_gateway_1.DispatchGateway],
        exports: [dispatch_service_1.DispatchService, dispatch_gateway_1.DispatchGateway],
    })
], DispatchModule);
//# sourceMappingURL=dispatch.module.js.map