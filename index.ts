import axios from 'axios';
import { scrapeHTML } from 'scrape-it';
import download from 'download';

const sleep = (seconds: number) => new Promise(resolve =>
    setTimeout(resolve, seconds * 1000)
);

const downloadChunks = async (params: {[key: string]: string | number}) => {
    const url = 'https://www.e-stat.go.jp/gis/statmap-search/search_detail';
    const res = await axios.get(url, { params });
    const sideMegaHtml = res.data.side_mega as string;
    const { hitNumber: hitNumberStr } = scrapeHTML<{
        hitNumber: string;
    }>(sideMegaHtml, {
        hitNumber: 'span.stat-hit-number',
    });
    const hitNumber = Number(hitNumberStr);
    const injectedDetailHtml = res.data.detail as string;
    const { articles } = scrapeHTML<{
        articles: {
            title: string;
            area: string;
            downloadUrl: string;
        }[];
    }>(injectedDetailHtml, {
        articles: {
            listItem: 'article.stat-resorce_list-item',
            data: {
                title: {
                    selector: 'li.stat-resorce_list-detail-item',
                    eq: 0,
                },
                area: {
                    selector: 'li.stat-resorce_list-detail-item',
                    eq: 1,
                },
                downloadUrl: {
                    selector: 'li.stat-resorce_list-detail-item a.stat-dl_icon',
                    attr: 'href',
                },
            },
        },
    });
    for (const article of articles) {
        const url = 'https://www.e-stat.go.jp' + article.downloadUrl;
        await download(url);
        await sleep(1);
        console.log(`Downloaded ${article.title} (${article.area})`);
    }
    return {
        hitNumber,
        articles,
    };
};

const main = async () => {
    // This is just for example
    const params = {
        type: 1,
        toukeiCode: '00200521',
        toukeiYear: '2020',
        aggregateUnit: 'H',
        serveyId: 'H002005112020',
        statsId: 'T001101',
        mesh_data_flg: 1,
        download_disp_flg: 1,
    };
    let page = 1;
    let articlesCount = 999;
    while (page * 20 < articlesCount) {
        const { hitNumber } = await downloadChunks({
            ...params,
            page,
        });
        articlesCount = hitNumber;
        page += 1;
    }
};

main();

