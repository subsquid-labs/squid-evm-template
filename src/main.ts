import {
    HotDatabaseState,
    HotDatabase,
    FinalTxInfo,
    HotTxInfo,
    HashAndHeight,
} from '@subsquid/util-internal-processor-tools'
import {processor} from './processor'

class MockDatabase implements HotDatabase<unknown> {
    readonly supportsHotBlocks = true

    async connect(): Promise<HotDatabaseState> {
        return {height: -1, hash: '0x', top: []}
    }

    async transact(info: FinalTxInfo, cb: (store: unknown) => Promise<void>): Promise<void> {
        return await cb(null)
    }

    async transactHot(info: HotTxInfo, cb: (store: unknown, block: HashAndHeight) => Promise<void>): Promise<void> {
        for (let b of info.newBlocks) {
            await cb(null, b)
        }
    }
}

processor.run(new MockDatabase(), async (ctx) => {
    for (let c of ctx.blocks) {
        for (let tx of c.transactions) {
            ctx.log.info(
                {id: tx.id, block: c.header.height, address: tx.from, value: tx.value, txHash: tx.hash},
                `Burn`
            )
        }
    }
})
