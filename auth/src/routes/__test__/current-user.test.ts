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

<<<<<<< HEAD
it('should return null if no cookies', async () => {
=======
it('should return null if no cookie', async () => {
>>>>>>> e35bbe8f3edc703694e646212121a93b44b7a937
    const response = await request(app)
        .get('/api/users/currentuser')
        .expect(200)

    expect(response.body.currentUser).toEqual(null)
})
