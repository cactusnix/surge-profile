# Surge Conf

## 简介

黑名单：只有在名单里面的走代理，其它都走直连
白名单：只有在名单里面的走直连，其它都走代理

一直纠结代理到底是黑名单还是白名单的形式，在实践了一段时间的黑名单之后，发现黑名单有以下几个问题，第一是黑名单太多了，可能通过 Google 搜索之后的很多网页都处于黑名单，需要频繁的增加黑名单，第二是哪怕有一些网站并没有被墙，但是直连的时候访问速度还是很慢，而通过代理则会加快访问速度。

这个时候就想着使用白名单，因为绝大部分能够直连的网站，通过代理是基本都可以访问的，只是因为服务器地理位置的原因，通过代理会变得缓慢，同时能够直连的网站大部分都比较固定，所以也不需要频繁的更新白名单。

因此基于以上的分析，采用了白名单+黑名单的形式，黑名单主要负责那些需要代理确定性强的，比如 Google、GitHub 等相关服务，他们的域名基本不会变更，同时是可以穷尽的。而白名单呢，用来负责需要直连确定性强的，比如 WeChat、Ali 等，同时增加一些类似 cn 域名的匹配提高直连命中率，还会通过 GeoIP 来辅助定位那些位置是 CN 的。其它不确定性的都通过代理，当发现平时使用访问缓慢的时候，再优先排查是否是代理的原因。

同时还有一个原则，现在全量配置的同步方式是通过托管 conf 到 gist，多设备统一公用一份，而 module 如果采用远程地址的话，是不会进行同步的，所以将一些特定的功能直接写死在全量 conf 里面的，比如豆瓣的开屏广告屏蔽需要 MitM 豆瓣的 hostname，以及搜索能力的增强等。

## General.list

这里会包含所有需要代理的规则，仅收集个人经常使用的网站和 App，也会根据不同服务拆分成对应的细分规则。

- Google
- GitHub
- Twitter
- YouTube
- Netflix

## China.list

这里会包含所有需要直连的规则，仅收集个人经常使用的网站和 App，也会根据不同服务拆分对应的细分规则。

- WeChat
-
