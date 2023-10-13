import request from 'supertest';
import app from "../../app";

it('should success if valid cookie', async () => {
    const cookie = await global.signin()

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .expect(200)

    expect(response.body.currentUser.id).toBeDefined()
    expect(response.body.currentUser.email).toEqual("test@test.com")

})

it('should return null if no cookies', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .expect(200)

    expect(response.body.currentUser).toEqual(null)
})
