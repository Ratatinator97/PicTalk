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
exports.Picto = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../auth/user.entity");
const collection_entity_1 = require("./collection.entity");
let Picto = (() => {
    let Picto = class Picto extends typeorm_1.BaseEntity {
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Picto.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Picto.prototype, "path", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Picto.prototype, "meaning", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Picto.prototype, "speech", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Picto.prototype, "folder", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Picto.prototype, "fatherId", void 0);
    __decorate([
        typeorm_1.ManyToOne(type => collection_entity_1.Collection, collection => collection.pictos, { eager: false }),
        __metadata("design:type", collection_entity_1.Collection)
    ], Picto.prototype, "collection", void 0);
    __decorate([
        typeorm_1.ManyToOne(type => user_entity_1.User, user => user.pictos, { eager: false }),
        __metadata("design:type", user_entity_1.User)
    ], Picto.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Picto.prototype, "userId", void 0);
    Picto = __decorate([
        typeorm_1.Entity()
    ], Picto);
    return Picto;
})();
exports.Picto = Picto;
//# sourceMappingURL=picto.entity.js.map