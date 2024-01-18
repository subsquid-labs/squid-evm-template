import {processor} from './processor'
import {MockDatabase} from '@belopash/mock-store'

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
