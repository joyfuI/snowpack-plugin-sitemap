# snowpack-plugin-sitemap

빌드할 때 사이트맵을 생성하는 Snowpack 플러그인

## 설치

```bash
npm i -D @joyfui/snowpack-plugin-sitemap
```

`yarn`을 사용한다면

```bash
yarn add -D @joyfui/snowpack-plugin-sitemap
```

`snowpack.config.js` 파일에 `snowpack-plugin-sitemap` 플러그인을 추가합니다.

```javascript
module.exports = {
  /* */
  plugins: ['@joyfui/snowpack-plugin-sitemap'],
  /* */
};
```

만약 플러그인 옵션을 지정하고 싶다면 아래처럼 추가합니다.

```javascript
module.exports = {
  /* */
  plugins: [
    [
      '@joyfui/snowpack-plugin-sitemap',
      {
        publicUrl: 'https://example.com/',
        exclude: [`include/*`],
        gzip: true,
        changefreq: 'monthly',
      },
    ],
  ],
  /* */
};
```

`snowpack build`를 실행할 때 `*.html, *.htm` 파일 목록을 바탕으로 `sitemap.xml` 파일을 생성합니다. 옵션을 통해 `sitemap.xml.gz` 생성 가능

## 플러그인 옵션

#### `publicUrl`

_타입_: `string`  
_기본값_: `process.env.PUBLIC_URL || snowpackConfig.buildOptions.baseUrl`

기본 URL을 지정합니다.

#### `exclude`

_타입_: `string[]`  
_기본값_: `[]`

제외한 파일 목록입니다. glob 패턴을 사용할 수 있습니다.

사용할 수 있는 패턴은 [링크](https://github.com/mrmlnc/fast-glob#pattern-syntax) 참고

#### `gzip`

_타입_: `boolean`  
_기본값_: `false`

`sitemap.xml` 대신 `sitemap.xml`을 압축한 `sitemap.xml.gz`를 생성합니다.

#### `changefreq`

_타입_: `always | hourly | daily | weekly | monthly | yearly | never`

`sitemap.xml`에서 페이지가 변경되는 빈도를 지정합니다. 지정하지 않으면 \<changefreq\> 속성을 추가하지 않습니다.

자세한 내용은 [명세](https://www.sitemaps.org/ko/protocol.html#xmlTagDefinitions) 참고
