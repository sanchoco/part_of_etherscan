# 이더스캔 부분 구현

### Description
블록 체인 내 데이터만 활용하여 이더스캔 기능 중 일부분 구현


### .env
```
ETHEREUM_PROVIDER= (required)
OPENSEA_API_KEY= (optional)
```

### Run
```
 npm install // 1. package install
 npm run build // 2. ts => js
 npm run start // 3. server start
```

## APIs
### Check
- **GET** /check/:address
  - 주소를 통한 계정 타입 확인
  - 리턴값: ```{ type: "EOA" | "FT" | "NFT" | "CONTRACT" }```
  - ``EOA``: 일반 사용자 계정
  - ``FT``: ERC20 토큰
  - ``NFT``: ERC721 토큰
  - ``CONTRACT``: 스마트 컨트랙트

#### EOA(External Owned Account)
- **GET** /eoa/:address
  - 계정 기본 정보 확인
  - 리턴값: ```{ address, balance, nonce }```
  - ``address``: 계정 주소
  - ``balance``: 해당 계정이 보유한 Ether
  - ``nonce``: 해당 계정이 발생시킨 트랜젝션 수

#### NFT(Non-fungible token)
- **GET** /nft/:nftAddress
  - NFT 기본 정보 확인
  - 리턴값: ```{ contractAddress, name, symbol, totalSupply }```
  - ``contractAddress``: NFT 주소
  - ``name``: NFT 이름
  - ``symbol``: NFT 심볼
  - ``totalSupply``: NFT 총 발행 수량
  
- **GET** /nft/:nftAddress/transfers
  - NFT 이동 내역 조회 (블록 번호 오름차순)
  - 리턴값: ```{ transfers: [{ blockNumber, transactionHash, from, to, tokenId }] }```
  - ``blockNumber``: 블록 번호
  - ``transactionHash``: 트랜젝션 해시
  - ``from``: 보낸 사람
  - ``to``: 받은 사람
  - ``tokenId``: NFT 토큰 번호
  - ex) BAYC(0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)
    <img width="3092" alt="스크린샷 2022-06-01 오후 5 50 38" src="https://user-images.githubusercontent.com/58046372/171365999-7be21a9d-229b-45b2-aef0-6f6b4c9a29e3.png">


- **GET** /nft/:nftAddress/holders
  - NFT 홀더 조회 (보유 수량별 내림차순)
  - 리턴값: ```{ holders:[{ address, tokenCount }] }```
  - ``address``: 소유자 주소
  - ``tokenCount``: 보유 수량
  - ex) BAYC(0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)
    <img width="1818" alt="스크린샷 2022-06-01 오후 5 58 00" src="https://user-images.githubusercontent.com/58046372/171367541-65ce4d5b-fb19-4726-a544-08c1895c976e.png">


- **GET** /nft/:nftAddress/owners
  - NFT 토큰 ID별 조회 (토큰 번호 오름차순)
  - 리턴값: ```{ owners:[{ tokenId, owner }] }```
  - ``tokenId``: NFT 토큰 번호
  - ``owner``: 소유자 주소
  - ex) BAYC(0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)
    <img width="595" alt="bayc-owners" src="https://user-images.githubusercontent.com/58046372/171361597-d7224e80-441c-4fb3-a16c-531874165abf.png">

- **GET** /nft/:nftAddress/opensea
  - NFT Opensea 데이터 조회(OPENSEA_API_KEY 필요)
  - 리턴값: ```{ opensea:[{ banner, image, homepage, name, symbol, totalSupply, description, oneDayVolume, sevenDayVolume, owners, avgPrice, marketCap, floorPrice }] }```
  - ex) BAYC(0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)
    <img width="1318" alt="스크린샷 2022-06-01 오후 5 38 53" src="https://user-images.githubusercontent.com/58046372/171363987-b0492a9a-9d74-46b6-aba7-186590a800ba.png">



### FT(Fungible token)
- **GET** /ft/:ftAddress
  - 토큰 기본 정보 확인
  - 리턴값: ```{ contractAddress, name, symbol, totalSupply }```
  - ``contractAddress``: 토큰 주소
  - ``name``: 토큰 이름
  - ``symbol``: 토큰 심볼
  - ``totalSupply``: 토큰 총 발행 수량
  
- **GET** /ft/:ftAddress/transfers
  - 토큰 이동 내역 조회 (블록 번호 오름차순)
  - 리턴값: ```{ transfers: [{ blockNumber, transactionHash, from, to, tokenId }] }```
  - ``blockNumber``: 블록 번호
  - ``transactionHash``: 트랜젝션 해시
  - ``from``: 보낸 사람
  - ``to``: 받은 사람
  - ``tokenId``: NFT 토큰 번호
  - ex) Agrolot Token(0x72c9fb7ed19d3ce51cea5c56b3e023cd918baadf)
    <img width="2119" alt="ft-transfer" src="https://user-images.githubusercontent.com/58046372/171361645-92f2e843-afcf-4f2e-87a3-e784155f23d8.png">


- **GET** /ft/:ftAddress/balances
  - 토큰 잔액 조회 (잔액 내림차순)
  - 리턴값: ```{ holders:[{ address, balance }] }```
  - ``address``: 소유자 주소
  - ``balance``: 보유 잔액
  - ex) Agrolot Token(0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)
    <img width="1536" alt="aglt-balance" src="https://user-images.githubusercontent.com/58046372/171361688-25763987-7dd5-4313-a449-1627ad240b5f.png">


