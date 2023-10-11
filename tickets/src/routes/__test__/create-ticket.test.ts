import request from "supertest";
import app from "../../app";

const correctData = {
    title: "title",
    price: 10
}

it('should fail if user unauthorized', async () => {
    await request(app)
        .post('/api/tickets')
        .send(correctData)
        .expect(401)
})

it('should fail if invalid title', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({title: '', price: 10})
        .expect(400)

    expect(response.body.errors[0].message).toEqual('Title is required')
})


it('should fail if invalid price', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({title: 'test', price: -10})
        .expect(400)

    expect(response.body.errors[0].message).toEqual('Price should be greater than 0')
})

it('should succeed if valid data', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send(correctData)
    expect(response.body.ticket.id).toBeDefined()
    expect(response.body.ticket.title).toEqual(correctData.title)
    expect(response.body.ticket.price).toEqual(correctData.price)
})
