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
exports.Collection = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../auth/user.entity");
const picto_entity_1 = require("./picto.entity");
let Collection = (() => {
    let Collection = class Collection extends typeorm_1.BaseEntity {
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Collection.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Collection.prototype, "path", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Collection.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Collection.prototype, "color", void 0);
    __decorate([
        typeorm_1.OneToMany(type => picto_entity_1.Picto, picto => picto.collection, { eager: true }),
        __metadata("design:type", Array)
    ], Collection.prototype, "pictos", void 0);
    __decorate([
        typeorm_1.ManyToOne(type => user_entity_1.User, user => user.collections, { eager: false }),
        __metadata("design:type", user_entity_1.User)
    ], Collection.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Collection.prototype, "userId", void 0);
    Collection = __decorate([
        typeorm_1.Entity()
    ], Collection);
    return Collection;
})();
exports.Collection = Collection;
//# sourceMappingURL=collection.entity.js.map