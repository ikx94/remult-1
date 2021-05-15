

import { fitAsync, itAsync } from './testHelper.spec';



import { iterateConfig, ServerContext } from '../context';

import { TestBed } from '@angular/core/testing';




import { fitWithDataProvider, itWithDataProvider } from './basicRowFunctionality.spec';
import { NumberColumn } from '../column';
import { Column, Entity, EntityBase } from '../remult3';



describe("custom id column", () => {
    itWithDataProvider("basic test", async (dpf) => {
        let context = new ServerContext(dpf);
        let type = class extends EntityBase {
            a: number;
            b: number;
        }
        Entity({ name: 'custom' })(type);
        Column()(type.prototype, 'a');
        Column()(type.prototype, 'b');
        let c = context.for(type);
        let r = c.create();
        r.a = 1;
        r.b = 1;
        await r._.save();
        r = c.create();
        r.a = 2;
        r.b = 2;
        await r._.save();
        expect(c.defs.idColumn.key).toBe(c.defs.columns.a.key);


    });
    itWithDataProvider("basic test id column not first column", async (dpf) => {
        let context = new ServerContext(dpf);
        let type = class extends EntityBase {
            a: number;
            id: number;
        }
        Entity({ name: 'custom2' })(type);
        Column({ type: Number })(type.prototype, 'a');
        Column({ type: Number })(type.prototype, 'id');
        let c = context.for(type);
        let r = c.create();
        r.a = 1;
        r.id = 5;
        await r._.save();
        r = c.create();
        r.a = 2;
        r.id = 6;
        await r._.save();
        expect(r._.repository.defs.idColumn.key).toBe(r._.columns.id.key);
        expect((await c.findId(6)).a).toBe(2);


    });

});