import provider from 'utils/provider';

export const baseUrl = '/api';

export default provider.createServices(
  {
    checkLogin: {
      method: 'get',
      url: '/security/authorization',
      progress: 'Alkalmazás betöltése...',
      skipToasts: true,
    },

    login: {
      method: 'post',
      url: '/security/authentication',
      progress: 'Kérem várjon, a bejelentkezés folyamatban van...',
      paramTypes: {
        username: 'body',
        password: 'body',
      },
    },
    logout: {
      method: 'delete',
      url: '/security/authentication',
      progress: 'Kérem várjon, a kijelentkezés folyamatban van...',
    },
    registration: {
      method: 'post',
      url: '/security/registration',
      progress: 'Kérem várjon, a fiók létrehozása folyamatban van...',
      paramTypes: {
        firstName: 'body',
        lastName: 'body',
        username: 'body',
        password: 'body',
      },
    },
    resetPassword: {
      method: 'post',
      url: '/security/password/reset',
      progress: 'Jelszó helyreállítás kérvényezése...',
      paramTypes: {
        username: 'body',
      },
    },
    changePassword: {
      method: 'post',
      url: '/security/password',
      progress: 'A jelszó frissítése folymatban van ...',
      paramTypes: {
        token: 'body',
        password: 'body',
      },
    },
    loadStats: {
      method: 'get',
      url: '/stats',
      progress: false,
      skipToasts: true,
    },

    loadPost: {
      method: 'get',
      url: '/post/{postId}',
      progress: 'A bejegyzés betöltése folyamatban van...',
      paramTypes: {
        postId: 'url',
      },
    },
    lockPost: {
      method: 'put',
      url: '/post/{postId}/lock',
      progress: 'A bejegyzés betöltése és zárolása folyamatban van...',
      paramTypes: {
        postId: 'url',
      },
    },
    unlockPost: {
      method: 'put',
      url: '/post/{postId}/unlock',
      progress: 'A bejegyzés zárolásának feloldása folyamatban van...',
      paramTypes: {
        postId: 'url',
      },
    },
    loadPosts: {
      method: 'get',
      url: '/post',
      progress: 'A bejegyzések betöltése folyamatban van...',
      paramTypes: {
        search: 'query',
        filter: 'query+param',
        sort: 'query+param',
        range: 'query+param',
      },
    },
    updatePost: {
      method: 'put',
      url: '/post/{postId}',
      progress: 'A szerkesztett bejegyzés mentése folyamatban van...',
      paramTypes: {
        postId: 'url',
        post: 'data',
        unlock: 'query',
      },
    },
    createPost: {
      method: 'post',
      url: '/post',
      progress: 'Az új bejegyzés mentése folyamatban van...',
      paramTypes: {
        post: 'data',
        unlock: 'query',
      },
    },
    deletePosts: {
      method: 'delete',
      url: '/post',
      progress: 'A bejegyzések törlése folyamatban van...',
      paramTypes: {
        id: 'query',
      },
    },

    loadBannerPositions: {
      method: 'get',
      url: '/banner-positions',
      progress: 'Banner pozíciók letöltése...',
      resultKey: 'result',
    },

    // banners
    loadBanners: {
      method: 'get',
      url: '/banner',
      progress: 'A bannerek listájának betöltése folyamatban van...',
      paramTypes: {
        filter: 'query+param',
        sort: 'query+param',
        range: 'query+param',
      },
    },
    loadBanner: {
      method: 'get',
      url: '/banner/{id}',
      progress: 'A banner betöltése folyamatban van...',
      paramTypes: {
        id: 'url',
      },
    },
    createBanner: {
      method: 'post',
      url: '/banner',
      progress: 'Az új banner mentése folyamatban van...',
      paramTypes: {
        item: 'data',
      },
    },
    updateBanner: {
      method: 'put',
      url: '/banner/{id}',
      progress: 'A banner mentése folyamatban van...',
      paramTypes: {
        id: 'url',
        item: 'data',
      },
    },
    deleteBanners: {
      method: 'delete',
      url: '/banner',
      progress: 'A bannerek törlése folyamatban van...',
      paramTypes: {
        id: 'query',
      },
    },

    // categories
    loadCategories: {
      method: 'get',
      url: '/category',
      progress: 'A kategóriák betöltése folyamatban van...',
      paramTypes: {
        filter: 'query+param',
        sort: 'query+param',
        range: 'query+param',
      },
    },
    loadCategory: {
      method: 'get',
      url: '/category/{categoryId}',
      progress: 'A kategória betöltése folyamatban van...',
      paramTypes: {
        categoryId: 'url',
      },
    },
    createCategory: {
      method: 'post',
      url: '/category',
      progress: 'Az új kategória mentése folyamatban van...',
      paramTypes: {
        category: 'data',
      },
    },
    updateCategory: {
      method: 'put',
      url: '/category/{categoryId}',
      progress: 'A kategória mentése folyamatban van...',
      paramTypes: {
        categoryId: 'url',
        category: 'data',
      },
    },
    deleteCategories: {
      method: 'delete',
      url: '/category',
      progress: 'A kategóriák törlése folyamatban van...',
      paramTypes: {
        id: 'query',
      },
    },

    // users
    loadUsers: {
      method: 'get',
      url: '/user',
      progress: 'A felhasználók adatainak betöltése folyamatban van...',
      paramTypes: {
        username: 'query',
        filter: 'query+param',
        sort: 'query+param',
        range: 'query+param',
      },
    },
    loadUser: {
      method: 'get',
      url: '/user/{userId}',
      progress: 'A felhasználó betöltése folyamatban van...',
      paramTypes: {
        userId: 'url',
      },
    },
    createUser: {
      method: 'post',
      url: '/user',
      progress: 'Az új felhasználó mentése folyamatban van...',
      paramTypes: {
        user: 'data',
      },
    },
    updateUser: {
      method: 'put',
      url: '/user/{userId}',
      progress: 'A felhasználó mentése folyamatban van...',
      paramTypes: {
        userId: 'url',
        user: 'data',
      },
    },
    deleteUsers: {
      method: 'delete',
      url: '/user',
      progress: 'A felhasználók törlése folyamatban van...',
      paramTypes: {
        id: 'query',
      },
    },

    loadTags: {
      method: 'get',
      url: '/tag',
      progress: 'A tagek betöltése folyamatban van...',
      paramTypes: {
        filter: 'query+param',
        sort: 'query+param',
        range: 'query+param',
      },
    },
    loadTag: {
      method: 'get',
      url: '/tag/{tagId}',
      progress: 'A tag betöltése folyamatban van...',
      paramTypes: {
        tagId: 'url',
      },
    },
    createTag: {
      method: 'post',
      url: '/tag',
      progress: 'Az új tag mentése folyamatban van...',
      paramTypes: {
        tag: 'data',
      },
    },
    updateTag: {
      method: 'put',
      url: '/tag/{tagId}',
      progress: 'A tag mentése folyamatban van...',
      paramTypes: {
        tagId: 'url',
        tag: 'data',
      },
    },
    deleteTags: {
      method: 'delete',
      url: '/tag',
      progress: 'A tagek törlése folyamatban van...',
      paramTypes: {
        id: 'query',
      },
    },

    loadMediaList: {
      method: 'get',
      url: '/media',
      progress: 'Az média adatok betöltése folyamatban van...',
      paramTypes: {
        search: 'query',
        galleryId: 'query',
        filter: 'query+param',
        sort: 'query+param',
        range: 'query+param',
      },
    },
    loadMedia: {
      method: 'get',
      url: '/media/{mediaId}',
      progress: 'Az média betöltése folyamatban van...',
      paramTypes: {
        mediaId: 'url',
      },
    },
    createMedia: {
      method: 'post',
      url: '/media',
      progress: 'Az új elem mentése folyamatban van...',
      paramTypes: {
        media: 'data',
      },
    },
    updateMedia: {
      method: 'put',
      url: '/media/{mediaId}',
      progress: 'Az elem mentése folyamatban van...',
      paramTypes: {
        mediaId: 'url',
        media: 'data',
      },
    },
    deleteMultipleMedia: {
      method: 'delete',
      url: '/media',
      progress: 'Az elem törlése folyamatban van...',
      paramTypes: {
        id: 'query',
      },
    },

    getSubscriptionLists: {
      method: 'get',
      url: '/subscription/list',
      skipToasts: true,
    },
    syncSubscriptionList: {
      method: 'put',
      url: '/subscription/sync/{listId}',
      paramTypes: {
        listId: 'url',
        subscriptionType: 'query',
      },
    },

    getSubscriptionTypes: {
      method: 'get',
      url: '/subscription/type',
      skipToasts: true,
    },
    addSubscriptionType: {
      method: 'post',
      url: '/subscription/type',
      progress: 'Feliratkozás típus hozzáadása...',
      paramTypes: {
        title: 'body',
      },
    },

    getJobs: {
      method: 'get',
      url: '/job',
      skipToasts: true,
      paramTypes: {
        detailed: 'query',
      },
    },
    getJob: {
      method: 'get',
      url: '/job/{jobId}',
      skipToasts: true,
      paramTypes: {
        jobId: 'url',
      },
    },

    loadSubscriptions: {
      method: 'get',
      url: '/subscription',
      progress: 'A feliratkozási lista betöltése folyamatban van...',
      paramTypes: {
        filter: 'query+param',
        sort: 'query+param',
        range: 'query+param',
      },
    },
    loadSubscription: {
      method: 'get',
      url: '/subscription/{subscriptionId}',
      progress: 'A feliratkozási adat betöltése folyamatban van...',
      paramTypes: {
        subscriptionId: 'url',
      },
    },
    createSubscription: {
      method: 'post',
      url: '/subscription',
      progress: 'Az új elem mentése folyamatban van...',
      paramTypes: {
        subscription: 'data',
      },
    },
    updateSubscription: {
      method: 'put',
      url: '/subscription/{subscriptionId}',
      progress: 'Az elem mentése folyamatban van...',
      paramTypes: {
        subscriptionId: 'url',
        subscription: 'data',
      },
    },
    deleteSubscriptions: {
      method: 'delete',
      url: '/subscription',
      progress: 'Az feliratkozás(ok) törlése folyamatban van...',
      paramTypes: {
        id: 'query',
      },
    },

    sendLog: {
      method: 'post',
      url: '/log',
      progress: false,
      skipToasts: true,
      paramTypes: {
        messages: 'data',
      },
    },

    loadSurveys: {
      method: 'get',
      url: '/survey',
      progress: 'A kérdőívek betöltése folyamatban van...',
      paramTypes: {},
    },

    downloadSurvey: {
      method: 'get',
      url: '/survey/{postId}',
      progress: 'A kérdőív töltése folyamatban van...',
      paramTypes: {
        postId: 'url',
        html: 'query',
        download: 'query',
      },
    },

    loadPolls: {
      method: 'get',
      url: '/poll',
      progress: 'A szavazások betöltése folyamatban van...',
      paramTypes: {
        filter: 'query+param',
        sort: 'query+param',
        range: 'query+param',
      },
    },
    loadPoll: {
      method: 'get',
      url: '/poll/{pollId}',
      progress: 'A szavazás betöltése folyamatban van...',
      paramTypes: {
        pollId: 'url',
      },
    },
    createPoll: {
      method: 'post',
      url: '/poll',
      progress: 'Az új szavazás mentése folyamatban van...',
      paramTypes: {
        poll: 'data',
      },
    },
    updatePoll: {
      method: 'put',
      url: '/poll/{pollId}',
      progress: 'A szavazás mentése folyamatban van...',
      paramTypes: {
        pollId: 'url',
        poll: 'data',
      },
    },
    deletePolls: {
      method: 'delete',
      url: '/poll',
      progress: 'A tagek törlése folyamatban van...',
      paramTypes: {
        id: 'query',
      },
    },
    getPostsByPollId: {
      url: '/portal/post/poll/{pollId}',
      paramTypes: {
        pollId: 'url',
      },
    },

    // galleries
    loadGalleries: {
      method: 'get',
      url: '/gallery',
      progress: 'A gallériák betöltése folyamatban van...',
      paramTypes: {
        filter: 'query+param',
        sort: 'query+param',
        range: 'query+param',
      },
    },
    loadGallery: {
      method: 'get',
      url: '/gallery/{id}',
      progress: 'A galéria betöltése folyamatban van...',
      paramTypes: {
        id: 'url',
      },
    },
    createGallery: {
      method: 'post',
      url: '/gallery',
      progress: 'Az új galéria mentése folyamatban van...',
      paramTypes: {
        item: 'data',
      },
    },
    updateGallery: {
      method: 'put',
      url: '/gallery/{id}',
      progress: 'A galéria mentése folyamatban van...',
      paramTypes: {
        id: 'url',
        item: 'data',
      },
    },
    deleteGalleries: {
      method: 'delete',
      url: '/gallery',
      progress: 'A gallériák törlése folyamatban van...',
      paramTypes: {
        id: 'query',
      },
    },

    loadPreferences: {
      method: 'get',
      url: '/preference',
      progress: 'A rendszer-beállítások betöltése folymatban van...',
    },

    updatePreference: {
      method: 'put',
      url: '/preference/{name}',
      progress: 'A rendszerbeállítás mentése folymatban van...',
      paramTypes: {
        name: 'url',
        type: 'body',
        value: 'body',
      },
    },
  },
  {
    // global config
    baseUrl,
    keepToasts: true,
  },
);
