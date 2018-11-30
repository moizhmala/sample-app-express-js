const deliveryClient = require('../delivery');
const hostedVideoResolver = require('../resolvers/hosted-video-resolver');
const tweetResolver = require('../resolvers/tweet-resolver');
const linkResolver = require('../resolvers/link-resolver');
const { Observable } = require('rxjs');

/**
 * Returns a repository for requesting articles from Kentico Cloud
 * @returns {ArticleRepository} an ArticleRepository object
 */
function ArticleRepository() {

    if (!(this instanceof ArticleRepository)) return new ArticleRepository();
    this.name = "ArticleRepository";
    this.items = void 0;

    this.createDummyObservable = function() {
        return Observable.create(observer => {
            observer.next(42);
            observer.complete();
        });
    }

    this.ensureItems = function() {
        if(this.items) {
            return this.createDummyObservable();
        }

        const obs = deliveryClient.items()
        .type('article')
        .orderParameter('elements.post_date', 1)
        .queryConfig({
            richTextResolver: (item) => {
                if (item.system.type == 'hosted_video') {
                return hostedVideoResolver.resolveModularContent(item);
                }
                else if (item.system.type == 'tweet') {
                return tweetResolver.resolveModularContent(item);
                }

                return "";
            },
            linkResolver: (link) => linkResolver.resolveContentLink(link)
        })
        .getObservable();

        obs.subscribe(response => {
            this.items = response.items;
        });
        
        return obs;
    }

    this.getAllArticles = function() {
        return this.items;
    }

    this.getArticle = function(id) {
        return this.items.filter((article) => article.system.id == id);
    }

}

module.exports = ArticleRepository;