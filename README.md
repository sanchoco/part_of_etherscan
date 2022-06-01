# 이더스캔 기능 부분 구현
> 온 체인 데이터만 활용


#### .env
```
ETHEREUM_PROVIDER= (required)
OPENSEA_API_KEY= (optional)
```

#### Check
- **GET /check/:address**
  - 주소를 통한 계정 타입 확인
  - 리턴값: ```{ type: "EOA" | "FT" | "NFT" | "CONTRACT" }```
  - ``EOA``: 일반 사용자 계정
  - ``FT``: ERC20 토큰
  - ``NFT``: ERC721 토큰
  - ``CONTRACT``: 스마트 컨트랙트

#### EOA(External Owned Account)
- **GET /eoa/:address**
  - 계정 기본 정보 확인
  - 리턴값: ```{ address, balance, nonce }```
  - ``address``: 계정 주소
  - ``balance``: 해당 계정이 보유한 Ether
  - ``nonce``: 해당 계정이 발생시킨 트랜젝션 수

#### NFT(Non-fungible token)
- **GET /nft/:nftAddress**
  - NFT 기본 정보 확인
  - 리턴값: ```{ contractAddress, name, symbol, totalSupply }```
  - ``contractAddress``: NFT 주소
  - ``name``: NFT 이름
  - ``symbol``: NFT 심볼
  - ``totalSupply``: NFT 총 발행 수량
  
- **GET /nft/:nftAddress/transfers**
  - NFT 이동 내역 조회
  - 리턴값: ```{ transfers: [{ blockNumber, transactionHash, from, to, tokenId }] }```
  - ``blockNumber``: 블록 번호
  - ``transactionHash``: 트랜젝션 해시
  - ``from``: 보낸 사람
  - ``to``: 받은 사람
  - ``tokenId``: NFT 토큰 번호
  - ex) BAYC(0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)

- **GET /nft/:nftAddress/holders**
  - NFT 홀더 조회 (수량별 내림차순)
  - 리턴값: ```{ holders:[{ address, itemCount }] }```
  - ``address``: 소유자 주소
  - ``itemCount``: 보유 수량
  - ex) BAYC(0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)

  
- **GET /nft/:nftAddress/owners**
  - NFT 토큰 ID별 조회 (tokenId 오름차순)
  - 리턴값: ```{ owners:[{ tokenId, owner }] }```
  - ``tokenId``: NFT 토큰 번호
  - ``owner``: 소유자 주소
  - ex) BAYC(0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)

#### FT(Fungible token)
- **GET /ft/:ftAddress**
  - 토큰 기본 정보 확인
  - 리턴값: ```{ contractAddress, name, symbol, totalSupply }```
  - ``contractAddress``: 토큰 주소
  - ``name``: 토큰 이름
  - ``symbol``: 토큰 심볼
  - ``totalSupply``: 토큰 총 발행 수량
  
- **GET /ft/:ftAddress/transfers**
  - 토큰 이동 내역 조회
  - 리턴값: ```{ transfers: [{ blockNumber, transactionHash, from, to, tokenId }] }```
  - ``blockNumber``: 블록 번호
  - ``transactionHash``: 트랜젝션 해시
  - ``from``: 보낸 사람
  - ``to``: 받은 사람
  - ``tokenId``: NFT 토큰 번호
  - ex) Agrolot Token(0x72c9fb7ed19d3ce51cea5c56b3e023cd918baadf)

- **GET /ft/:ftAddress/balances**
  - 토큰 잔액 조회
  - 리턴값: ```{ holders:[{ address, balance }] }```
  - ``address``: 소유자 주소
  - ``balance``: 보유 잔액
  - ex) Agrolot Token(0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)


