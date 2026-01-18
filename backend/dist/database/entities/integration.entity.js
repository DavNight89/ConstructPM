"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Integration = exports.IntegrationStatus = exports.IntegrationType = void 0;
const typeorm_1 = require("typeorm");
var IntegrationType;
(function (IntegrationType) {
    IntegrationType["QUICKBOOKS"] = "quickbooks";
    IntegrationType["SALESFORCE"] = "salesforce";
    IntegrationType["SHAREPOINT"] = "sharepoint";
    IntegrationType["SQL_SERVER"] = "sql-server";
    IntegrationType["ORACLE"] = "oracle";
    IntegrationType["MYSQL"] = "mysql";
    IntegrationType["GOOGLE_DRIVE"] = "google-drive";
    IntegrationType["DROPBOX"] = "dropbox";
    IntegrationType["BOX"] = "box";
})(IntegrationType || (exports.IntegrationType = IntegrationType = {}));
var IntegrationStatus;
(function (IntegrationStatus) {
    IntegrationStatus["CONNECTED"] = "connected";
    IntegrationStatus["DISCONNECTED"] = "disconnected";
    IntegrationStatus["ERROR"] = "error";
})(IntegrationStatus || (exports.IntegrationStatus = IntegrationStatus = {}));
let Integration = class Integration {
    id;
    name;
    type;
    status;
    credentials;
    config;
    lastSync;
    syncStatus;
    errorLog;
    createdAt;
    updatedAt;
};
exports.Integration = Integration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Integration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Integration.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IntegrationType,
    }),
    __metadata("design:type", String)
], Integration.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IntegrationStatus,
        default: IntegrationStatus.DISCONNECTED,
    }),
    __metadata("design:type", String)
], Integration.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Integration.prototype, "credentials", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Integration.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Integration.prototype, "lastSync", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Integration.prototype, "syncStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Integration.prototype, "errorLog", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Integration.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Integration.prototype, "updatedAt", void 0);
exports.Integration = Integration = __decorate([
    (0, typeorm_1.Entity)('integrations')
], Integration);
//# sourceMappingURL=integration.entity.js.map