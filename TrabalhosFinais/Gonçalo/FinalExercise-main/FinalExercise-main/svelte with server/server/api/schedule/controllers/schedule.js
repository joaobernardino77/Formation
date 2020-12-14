'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    create:async ctx => {
        const {monday, tuesday, wednesday, thursday, friday} = ctx.request.body
        const {id} = ctx.state.user

        const schedule = await strapi.services.schedule.create({
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            users_permissions_user: id
        })

        return schedule
    }
};
