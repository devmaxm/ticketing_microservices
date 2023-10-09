import request from 'supertest';
import app from "../../app";



it('should return fail if request without cookies', async () => {
    const response = await request(app)
        .post('/api/users/signout')
        .expect(401)

    expect(response.body.errors[0].message).toEqual('Unauthorized')
})

it('should return fail if invalid cookie', async () => {
    const response = await request(app)
        .post('/api/users/signout')
        .set("Cookie", 'test')
        .expect(401)

    expect(response.body.errors[0].message).toEqual('Unauthorized')
})

it('should success if valid cookie', async () => {
    const cookie = await global.signin()
    const response = await request(app)
        .post('/api/users/signout')
        .set("Cookie", cookie)
        .expect(200)

    expect(response.body).toEqual({})
})
