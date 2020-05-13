"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PictosModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const pictos_controller_1 = require("./pictos.controller");
const pictos_service_1 = require("./pictos.service");
const collection_service_1 = require("./collection.service");
const collection_repository_1 = require("./collection.repository");
const typeorm_1 = require("@nestjs/typeorm");
const picto_repository_1 = require("./picto.repository");
const auth_module_1 = require("../auth/auth.module");
let PictosModule = (() => {
    let PictosModule = class PictosModule {
    };
    PictosModule = __decorate([
        common_1.Module({
            imports: [
                platform_express_1.MulterModule.register({
                    dest: './files',
                }),
                typeorm_1.TypeOrmModule.forFeature([collection_repository_1.CollectionRepository]),
                typeorm_1.TypeOrmModule.forFeature([picto_repository_1.PictoRepository]),
                auth_module_1.AuthModule,
            ],
            controllers: [pictos_controller_1.PictosController],
            providers: [pictos_service_1.PictoService, collection_service_1.CollectionService],
        })
    ], PictosModule);
    return PictosModule;
})();
exports.PictosModule = PictosModule;
//# sourceMappingURL=pictos.module.js.map