"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFormDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_form_dto_1 = require("./create-form.dto");
class UpdateFormDto extends (0, swagger_1.PartialType)(create_form_dto_1.CreateFormDto) {
}
exports.UpdateFormDto = UpdateFormDto;
//# sourceMappingURL=update-form.dto.js.map