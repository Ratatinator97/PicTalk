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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PictosController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const user_entity_1 = require("../auth/user.entity");
const pictos_service_1 = require("./pictos.service");
const collection_service_1 = require("./collection.service");
const create_picto_dto_1 = require("./dto/create-picto.dto");
const create_collection_dto_1 = require("./dto/create-collection.dto");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("./file-upload.utils");
const multer_1 = require("multer");
let PictosController = (() => {
    let PictosController = class PictosController {
        constructor(pictoService, collectionService) {
            this.pictoService = pictoService;
            this.collectionService = collectionService;
            this.logger = new common_1.Logger('TasksController');
        }
        getUserCollections(user) {
            this.logger.verbose(`User "${user.username}" retrieving collections`);
            return this.collectionService.getUserCollections(user);
        }
        async getPictos(id, collectionId, user) {
            this.logger.verbose(`User "${user.username}" retrieving childs pictos of "${id}" of "${user.username}"`);
            const collection = await this.collectionService.getCollection(collectionId, user);
            return this.pictoService.getPictos(id, user, collection);
        }
        async createPicto(collectionId, createPictoDto, user, file) {
            if (file) {
                let isFolder;
                if (createPictoDto.fatherId != 0) {
                    isFolder = await this.pictoService.isFolder(createPictoDto.fatherId, user);
                }
                else {
                    isFolder = 1;
                }
                if (isFolder) {
                    this.logger.verbose(`User "${user.username}" creating a new Picto. Data: ${JSON.stringify(createPictoDto)} of "${user.username}"`);
                    const collection = await this.collectionService.getCollection(collectionId, user);
                    return this.pictoService.createPicto(createPictoDto, user, file.filename, collection);
                }
                else {
                    throw new common_1.InternalServerErrorException(`Collection doesn't exist OR the picto with id: "${createPictoDto.fatherId}" isn't a folder`);
                }
            }
            else {
                throw new common_1.InternalServerErrorException('File needed');
            }
        }
        createCollection(file, createCollectionDto, user) {
            this.logger.verbose(`User "${user.username}" creating a new collection. Data: ${JSON.stringify(createCollectionDto)} of "${user.username}"`);
            if (file) {
                return this.collectionService.createCollection(createCollectionDto, user, file.filename);
            }
            else {
                throw new common_1.InternalServerErrorException('File needed');
            }
        }
        async deleteCollection(id, user) {
            const collection = await this.collectionService.getCollection(id, user);
            try {
                this.pictoService.deletePictoOfCollection(collection, user);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException();
            }
            return this.collectionService.deleteCollection(id, user);
        }
        deletePicto(id, user) {
            return this.pictoService.deletePicto(id, user);
        }
    };
    __decorate([
        common_1.Get('/collection'),
        __param(0, get_user_decorator_1.GetUser()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [user_entity_1.User]),
        __metadata("design:returntype", Promise)
    ], PictosController.prototype, "getUserCollections", null);
    __decorate([
        common_1.Get('picto/:id/:collectionId'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe)),
        __param(1, common_1.Param('collectionId', common_1.ParseIntPipe)),
        __param(2, get_user_decorator_1.GetUser()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Number, user_entity_1.User]),
        __metadata("design:returntype", Promise)
    ], PictosController.prototype, "getPictos", null);
    __decorate([
        common_1.Post('/picto/:collectionId'),
        common_1.UsePipes(common_1.ValidationPipe),
        common_1.UseInterceptors(platform_express_1.FileInterceptor('image', {
            storage: multer_1.diskStorage({
                destination: './files',
                filename: file_upload_utils_1.editFileName,
            }),
            fileFilter: file_upload_utils_1.imageFileFilter,
        })),
        __param(0, common_1.Param('collectionId', common_1.ParseIntPipe)),
        __param(1, common_1.Body()),
        __param(2, get_user_decorator_1.GetUser()),
        __param(3, common_1.UploadedFile()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, create_picto_dto_1.CreatePictoDto,
            user_entity_1.User, Object]),
        __metadata("design:returntype", Promise)
    ], PictosController.prototype, "createPicto", null);
    __decorate([
        common_1.Post('/collection'),
        common_1.UsePipes(common_1.ValidationPipe),
        common_1.UseInterceptors(platform_express_1.FileInterceptor('image', {
            storage: multer_1.diskStorage({
                destination: './files',
                filename: file_upload_utils_1.editFileName,
            }),
            fileFilter: file_upload_utils_1.imageFileFilter,
        })),
        __param(0, common_1.UploadedFile()),
        __param(1, common_1.Body()),
        __param(2, get_user_decorator_1.GetUser()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, create_collection_dto_1.CreateCollectionDto,
            user_entity_1.User]),
        __metadata("design:returntype", Promise)
    ], PictosController.prototype, "createCollection", null);
    __decorate([
        common_1.Delete('/collection/:id'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe)),
        __param(1, get_user_decorator_1.GetUser()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, user_entity_1.User]),
        __metadata("design:returntype", Promise)
    ], PictosController.prototype, "deleteCollection", null);
    __decorate([
        common_1.Delete('/picto/:id'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe)),
        __param(1, get_user_decorator_1.GetUser()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, user_entity_1.User]),
        __metadata("design:returntype", Promise)
    ], PictosController.prototype, "deletePicto", null);
    PictosController = __decorate([
        common_1.Controller('pictalk'),
        common_1.UseGuards(passport_1.AuthGuard()),
        __metadata("design:paramtypes", [pictos_service_1.PictoService,
            collection_service_1.CollectionService])
    ], PictosController);
    return PictosController;
})();
exports.PictosController = PictosController;
//# sourceMappingURL=pictos.controller.js.map