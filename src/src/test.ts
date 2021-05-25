
function InitTests()
{
    const { IsTestnet } = Util();

    interface Addresses
    {
        segwitAddress: string;
        bech32Address: string;
        legacyAddress: string;
    }

    interface TestAddressAndPrivateKey
    {
        privateKey: string;
        addresses: Addresses;
    }

    interface Bip38Test
    {
        encryptedPrivateKey: string;
        encryptedPrivateKeyFromPrivateKey: string;
        decryptedPrivateKey: string;
        password: string;
        addresses: Addresses;
    }

    interface Bip39Test
    {
        seed: string;
        password: string;
        rootKey: string;
    }

    interface Bip32Test
    {
        rootKey: string;
        path: string;
        extendedPubkey: string;
        extendedPrivateKey: string;
    }

    async function RunAllTests(onProgress: (current: number, total: number) => void): Promise<string[]>
    {
        if (IsTestnet())
        {
            alert("No tests are implemented for testnet!");
            return [];
        }

        const totalNumTests = 42;
        let numCompletedTests = 0;

        function UpdateProgress()
        {
            onProgress(numCompletedTests++, totalNumTests);
        }

        const failedTestMessages: string[] = [];

        function AssertEqual(actual: any, expected: any, errorMessage: string)
        {
            if (actual !== expected)
            {
                failedTestMessages.push(`Assertion failed: ${errorMessage}\nExpected: ${expected}\nActual: ${actual}`);
            }
        }

        function Assert(actual: boolean, errorMessage: string)
        {
            AssertEqual(actual, true, errorMessage);
        }

        async function TestAddressesAndPrivateKeys()
        {
            const testAddresses: TestAddressAndPrivateKey[] = [];

            testAddresses.push({
                privateKey: "PmXJQc6rBzPeoRPSKNkVMRSFmr43WVXWiW8D2csXqvoH7vCqtDGL",
                addresses: {
                    segwitAddress: "EWxXAc5JFQrp6mjTg6GX6ULf5RmB4stbLn",
                    bech32Address: "wc1qkzjhw5l5h8umfzq236tk3gfgf5jwzftmm3wwqf",
                    legacyAddress: "Wen42UfRp1Pq1NoQWQUVK25FbQHUT2JfbX"
                }
            });
            testAddresses.push({
                privateKey: "PgrKCE8M4t7xgodGUEBJkevRyvJJtVqYviWWTAhhsMvnHgMQEwLa",
                addresses: {
                    segwitAddress: "EYTgZd5mF2rUra4hKjWA9AFwC4i1KAaEDA",
                    bech32Address: "wc1qchfun79t0geusfenamy6aw0e4jvz4u6uwq7dwz",
                    legacyAddress: "Wgi3i5AM28vxjrfKtPvJZgFaUHdY6i3D84"
                }
            });
            testAddresses.push({
                privateKey: "PmQtECge49UdU7ZrerXA2pamVZrfBuBiJzWreueGwns2ddrodfx5",
                addresses: {
                    segwitAddress: "ETvH4rx1i9uiZEKq1d6qs4jsPBDGb9Vf8b",
                    bech32Address: "wc1qx2t0stpfjy8v32xu9hcj5zee7grwu4q78py69d",
                    legacyAddress: "WTHXX4Mfaz7WTBkJ4V4TmKGfsWfBLUZypK"
                }
            });
            testAddresses.push({
                privateKey: "PiJgDm99V4VbnzSCcPqaLxLtv8Zp2VMpx7kSZqwbgkjAQK2dgtUo",
                addresses: {
                    segwitAddress: "EafQ3UWZq6CQ652MKkXUZzZk9nPN8Uc4BH",
                    bech32Address: "wc1qcuae32w2txarvuae7nkneh5rqw2rlmlg9qjrud",
                    legacyAddress: "WgqUjvo4zU4pkRcsj5A6ZX63dWLCP6HcL5"
                }
            });
            testAddresses.push({
                privateKey: "PiPvrVemsRPKdv7FcPfx1zkzi9bMQ5Wd4X2sipU9sFjH7SWQcyEo",
                addresses: {
                    segwitAddress: "EfcZhJ8uXj2mDqap9pQP54sLByeSu4Hzj5",
                    bech32Address: "wc1q7p5nd2470m7twg5mhy0le6z76r5fpmsyj94hxw",
                    legacyAddress: "WkbD6LDVU96Fd8TUpyuSyjVF7N88goSFo3"
                }
            });

            await Promise.all(testAddresses.map(testCase => (async () =>
            {
                try
                {
                    const privateKeyResult = await WorkerInterface.GetPrivateKeyDetails(testCase.privateKey);
                    if (privateKeyResult.type !== "ok")
                    {
                        Assert(false, `Address generation error for private key: ${testCase.privateKey}`);
                        return;
                    }

                    const { segwitAddress, bech32Address, legacyAddress } = privateKeyResult;

                    AssertEqual(segwitAddress, testCase.addresses.segwitAddress, "Segwit address does not match");
                    AssertEqual(bech32Address, testCase.addresses.bech32Address, "Bech32 address does not match");
                    AssertEqual(legacyAddress, testCase.addresses.legacyAddress, "Legacy address does not match");
                }
                catch (e)
                {
                    Assert(false, "Unexpected error: " + e.message);
                }

                UpdateProgress();
            })()));
        }

        async function TestBip38()
        {
            const testCases: Bip38Test[] = [];

            testCases.push({
                password: "a",
                encryptedPrivateKey: "6PnUzdM1kyfsH7j52z1nPx4EhPYVdSi9YDzMpfoUfL6m8RNmbZHxD5mTUy",
                encryptedPrivateKeyFromPrivateKey: "6PYWGmpCtGHbyQ2ZR7K4ECKYGCsE8v9giN3axnBQzN2kXmQmBp3P8PSeM5", // not yet
                decryptedPrivateKey: "Pkx8tsoDi5dAN7ULDfZ7axBEoHjyu2Q8ybGrC6SwTPGf9s1aoBSz",
                addresses: {
                    segwitAddress: "EWV7jeXksyYcWf4PuEcsuA8v6GGJRttdnm",
                    bech32Address: "wc1quc9p798mmspny0xrk5qx6rxuxp4ga93twv47mv",
                    legacyAddress: "WjeNRJAuV8DwvSM15WCvMveLEGrtZDip7b"
                }
            });
            testCases.push({
                password: "a",
                encryptedPrivateKey: "6PnUKdALdbXPTAZ3eGvzPXs2gtB6MfpDVvvHgXYVzYSL4ZZ615j3R583Mw",
                encryptedPrivateKeyFromPrivateKey: "6PYTLuvmnpCS7N3zvMfGEqrtvst8oip4nc7vBFoMu3YhW8LrGPKaM6nNrj", // not yet
                decryptedPrivateKey: "Pi9UszR9y1NDpF1g1MxXcCyXtQEbB9UU9Zz2B2qzJP1qzf1dmH45",
                addresses: {
                    segwitAddress: "ELHVhErm5WwcoHtYnUsx5NLsbHVuvAYZ1c",
                    bech32Address: "wc1qnvmrthze59w0uc9jqp0c4yp8hny2qhe6mf9rh9",
                    legacyAddress: "WcpiZGMhGfdRWz9HfhKxuhSZkZEWhyVcmX"
                }
            });
            testCases.push({
                password: "Test Password 1234",
                encryptedPrivateKey: "6PnSbif4GKBTscrrAL4ozpTk516r5NPDdx1zTk3jkNfmhf3s4yuqEsq8za",
                encryptedPrivateKeyFromPrivateKey: "6PYTBxtzid2TotMFVQJcjtJ7U3wVVkL3yZWEm1zo37bbY31vaizYWf253o", // not yet
                decryptedPrivateKey: "PiZYc5LfEGw6oGnrM8LraCL2E9uTU1qJcJZzAqtR1wrbF9vFAVyy",
                addresses: {
                    segwitAddress: "EKxfsVKRUXvz8HnaWjsAFjn5GeRC3Y25BJ",
                    bech32Address: "wc1q3fzl6wzuqnr8mq5sad7l64sftu2dcketgcwkh8",
                    legacyAddress: "WbH9yLA1kDeKTxMxdnoxWww8ErYiuocwnH"
                }
            });
            testCases.push({
                password: "Test Password 1234",
                encryptedPrivateKey: "6PnUiM9Vq7LbPGpVZX8qqTL8L8SajiijSeBwiAbJMCtCsfU18oL8oagtxw",
                encryptedPrivateKeyFromPrivateKey: "6PYUtSMKLHijKpqFyvXarqMAx84UR476iHfkLWGxh3LgeuX6Nghhijuzcm", // not yet
                decryptedPrivateKey: "Peyu6ff8q8A88rPSratvJ6wJ1fDdLSeBh72L2sCvBhjD66CFQvcy",
                addresses: {
                    segwitAddress: "EgS4RDjwrDDzHomCrNiSNWH5NGGuYAZuoo",
                    bech32Address: "wc1q8r4fpktl9an4lttmp7aqet0gyr2crfz7weg240",
                    legacyAddress: "WTryib7gZvHWnZet4aUaF1QFdea3sgzQ2o"
                }
            });
            testCases.push({
                password: "😂👌🔥💯💯💯🅱",
                encryptedPrivateKey: "6PnTxkhjN99wEqo2b4rMZJAHexg9SQ2FxvxQQQStByec9EUUqutDnvFYKP",
                encryptedPrivateKeyFromPrivateKey: "6PYKknEz8gZLf63HuiHUExku1WH1jt33ehFKj6viqwmVxWFAanMAxNqpun", // not yet
                decryptedPrivateKey: "PmPJd3JrtoKP7T1aZSpp2mcVzvRUssru54Gii3yNJc7ravTo6j8s",
                addresses: {
                    segwitAddress: "ELHGy9zVW9mLTgL4pdw3HAnR7KWFvNkyow",
                    bech32Address: "wc1q6h72cewj0h4j7auhs3zf0epgn6d22y0785ac7t",
                    legacyAddress: "WiBVVqySibJQbLSVRS3ka3kh6gSwJBwABN"
                }
            });
            testCases.push({
                password: "😂👌🔥💯💯💯🅱",
                encryptedPrivateKey: "6PnXGq35PBZJxSrPQmEo42AhG4krxN7xaWM798oz8LyzbDcqeHSJDxP7Jq",
                encryptedPrivateKeyFromPrivateKey: "6PYKqEWxjimL8o7cQghwBwF13wNW7SWr4PNqi8eDHNM55G7RiRQvRLcwAH", // not yet
                decryptedPrivateKey: "PeQ9ztj6G49RrH8Yv1CQHU2wehj9APznVsFUqKB9pgQymH1rRHYf",
                addresses: {
                    segwitAddress: "EYpKM9qCzSw1VfuHuEmqhZ54G9LvpPtTEB",
                    bech32Address: "wc1q6y3z8ttsgztx226jeeuf0tf3yv3jral2pardc7",
                    legacyAddress: "Whjq14ihUk9eTpGQYsQEmSKjEs3DfYM1sv"
                }
            });

            await Promise.all(testCases.map(testCase => (async () =>
            {
                async function TestDecrypt(privateKey: string, password: string)
                {
                    try
                    {
                        const decrypted = await WorkerInterface.BIP38DecryptPrivateKey(privateKey, password);
                        if (decrypted.type === "err")
                        {
                            Assert(false, `Bip38 decrypt error for private key "${privateKey}" with password "${password}"`);
                        }
                        else
                        {
                            const decryptedPrivateKey = decrypted.result;
                            AssertEqual(decryptedPrivateKey, testCase.decryptedPrivateKey, "Decrypted private keys do not match");

                            const addressResult = await WorkerInterface.GetPrivateKeyDetails(decryptedPrivateKey);
                            if (addressResult.type !== "ok")
                            {
                                Assert(false, `Cannot get addresses from private key: ${decryptedPrivateKey}`);
                            }
                            else
                            {
                                AssertEqual(addressResult.segwitAddress, testCase.addresses.segwitAddress, "Decrypted segwit address does not match");
                                AssertEqual(addressResult.bech32Address, testCase.addresses.bech32Address, "Decrypted bech32 address does not match");
                                AssertEqual(addressResult.legacyAddress, testCase.addresses.legacyAddress, "Decrypted legacy address does not match");
                            }
                        }
                    }
                    catch (e)
                    {
                        Assert(false, "Unexpected error: " + e.message);
                    }
                }

                await TestDecrypt(testCase.encryptedPrivateKey, testCase.password);
                await TestDecrypt(testCase.encryptedPrivateKeyFromPrivateKey, testCase.password);

                async function TestEncrypt(privateKey: string, password: string)
                {
                    try
                    {
                        const encrypted = await WorkerInterface.BIP38EncryptPrivateKey(privateKey, password);
                        if (encrypted.type === "err")
                        {
                            Assert(false, `Cannot encrypt private key: ${privateKey} (using password: "${password}")`)
                        }
                        else
                        {
                            AssertEqual(encrypted.result, testCase.encryptedPrivateKeyFromPrivateKey, "Encrypted private key does not match");
                        }
                    }
                    catch (e)
                    {
                        Assert(false, "Unexpected error: " + e.message);
                    }
                }

                await TestEncrypt(testCase.decryptedPrivateKey, testCase.password);

                UpdateProgress();
            })()));
        }

        async function TestBip39()
        {
            const testCases: Bip39Test[] = [];
            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "",
                rootKey: "xprv9s21ZrQH143K3GJpoapnV8SFfukcVBSfeCficPSGfubmSFDxo1kuHnLisriDvSnRRuL2Qrg5ggqHKNVpxR86QEC8w35uxmGoggxtQTPvfUu"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "a",
                rootKey: "xprv9s21ZrQH143K2TDcPeVnyE7Txn71rTGhYsXrdQBVMqYjubbSV4pCGMQXzim3ayzK46pURGRCG5r6KbkDN9NLQUTCDwZk9WU3tkSRZj6k6Gm"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "Test Password 1234",
                rootKey: "xprv9s21ZrQH143K2Y2XSuzBQaznCBg9AaRH2S25oKUAjmQEsEccMs8Ze85oGXge9xadr9vJv3r8CCtjgTGWFSjm6cHHAfGYJriZt43JgKVxDe1"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "😂👌🔥💯💯💯🅱",
                rootKey: "xprv9s21ZrQH143K3GPCDEC6aPqoyLsG2u3k1Lm98EuPJX6F92WXrU4BPKdjkabyje5myuDWhyzUxa8ibSzUSJAb3ULLYLLdwMrxLH48dQunkpr"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "",
                rootKey: "xprv9s21ZrQH143K3vkVeVcLG5PeVoexN6hpu9r4mS2j3uVeZo7vBrRNGHENDZXwYBgbQ5eMvHCX9YRL8V7aykC7a4UNkvJCuBacLRHwsdMGhNF"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "a",
                rootKey: "xprv9s21ZrQH143K3Fh1GnR64eBTs2WRhNz7Fc7NSXheWAnurFqLLjNRD7FNJXbdWm7Ky3B3hS3Lob6vSJd1PY6eZ7XUmTR6PCfCGzyt4Z4FRaM"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "Test Password 1234",
                rootKey: "xprv9s21ZrQH143K2MRhDJs9Qk6iSxHhezBbDGE1GFQqWy5zyw9P32GbXeM387p61HcQKdN93eL2W5Z3vF9ty9Gmr3ZtedcFLsDMZ3fkMcKBK2s"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "😂👌🔥💯💯💯🅱",
                rootKey: "xprv9s21ZrQH143K26EJnA1yj46hTFK85x2X2JeghGeichfdSdLAoQfgA5fQHvSo556Qjme7mXN3AbvDPhioe9C5GhmFAzQWdaSvnvkyuHy5mQa"
            });

            await Promise.all(testCases.map(testCase => (async () =>
            {
                try
                {
                    if (!(<any>String.prototype).normalize)
                    {
                        // string normalize not available, skip this test
                        return;
                    }

                    const seedResult = await WorkerInterface.GetBIP32RootKeyFromSeed(testCase.seed, testCase.password);
                    if (seedResult.type === "err")
                    {
                        Assert(false, `Cannot get root key from seed: "${testCase.seed}" (using password: "${testCase.password}")`);
                    }
                    else
                    {
                        AssertEqual(seedResult.result, testCase.rootKey, "Root key derived from mnemonic seed does not match");
                    }
                }
                catch (e)
                {
                    Assert(false, "Unexpected error: " + e.message);
                }

                UpdateProgress();
            })()));
        }

        async function TestBip32()
        {
            const testCases: Bip32Test[] = [];
            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8",
                extendedPrivateKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'",
                extendedPubkey: "xpub68Gmy5EdvgibQVfPdqkBBCHxA5htiqg55crXYuXoQRKfDBFA1WEjWgP6LHhwBZeNK1VTsfTFUHCdrfp1bgwQ9xv5ski8PX9rL2dZXvgGDnw",
                extendedPrivateKey: "xprv9uHRZZhk6KAJC1avXpDAp4MDc3sQKNxDiPvvkX8Br5ngLNv1TxvUxt4cV1rGL5hj6KCesnDYUhd7oWgT11eZG7XnxHrnYeSvkzY7d2bhkJ7"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1",
                extendedPubkey: "xpub6ASuArnXKPbfEwhqN6e3mwBcDTgzisQN1wXN9BJcM47sSikHjJf3UFHKkNAWbWMiGj7Wf5uMash7SyYq527Hqck2AxYysAA7xmALppuCkwQ",
                extendedPrivateKey: "xprv9wTYmMFdV23N2TdNG573QoEsfRrWKQgWeibmLntzniatZvR9BmLnvSxqu53Kw1UmYPxLgboyZQaXwTCg8MSY3H2EU4pWcQDnRnrVA1xe8fs"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'",
                extendedPubkey: "xpub6D4BDPcP2GT577Vvch3R8wDkScZWzQzMMUm3PWbmWvVJrZwQY4VUNgqFJPMM3No2dFDFGTsxxpG5uJh7n7epu4trkrX7x7DogT5Uv6fcLW5",
                extendedPrivateKey: "xprv9z4pot5VBttmtdRTWfWQmoH1taj2axGVzFqSb8C9xaxKymcFzXBDptWmT7FwuEzG3ryjH4ktypQSAewRiNMjANTtpgP4mLTj34bhnZX7UiM"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'/2",
                extendedPubkey: "xpub6FHa3pjLCk84BayeJxFW2SP4XRrFd1JYnxeLeU8EqN3vDfZmbqBqaGJAyiLjTAwm6ZLRQUMv1ZACTj37sR62cfN7fe5JnJ7dh8zL4fiyLHV",
                extendedPrivateKey: "xprvA2JDeKCSNNZky6uBCviVfJSKyQ1mDYahRjijr5idH2WwLsEd4Hsb2Tyh8RfQMuPh7f7RtyzTtdrbdqqsunu5Mm3wDvUAKRHSC34sJ7in334"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'/2/1000000000",
                extendedPubkey: "xpub6H1LXWLaKsWFhvm6RVpEL9P4KfRZSW7abD2ttkWP3SSQvnyA8FSVqNTEcYFgJS2UaFcxupHiYkro49S8yGasTvXEYBVPamhGW6cFJodrTHy",
                extendedPrivateKey: "xprvA41z7zogVVwxVSgdKUHDy1SKmdb533PjDz7J6N6mV6uS3ze1ai8FHa8kmHScGpWmj4WggLyQjgPie1rFSruoUihUZREPSL39UNdE3BBDu76"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcEZVB4dScxMAdx6d4nFc9nvyvH3v4gJL378CSRZiYmhRoP7mBy6gSPSCYk6SzXPTf3ND1cZAceL7SfJ1Z3GC8vBgp2epUt13",
                extendedPrivateKey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6",
                path: "m/0'",
                extendedPubkey: "xpub68NZiKmJWnxxS6aaHmn81bvJeTESw724CRDs6HbuccFQN9Ku14VQrADWgqbhhTHBaohPX4CjNLf9fq9MYo6oDaPPLPxSb7gwQN3ih19Zm4Y",
                extendedPrivateKey: "xprv9uPDJpEQgRQfDcW7BkF7eTya6RPxXeJCqCJGHuCJ4GiRVLzkTXBAJMu2qaMWPrS7AANYqdq6vcBcBUdJCVVFceUvJFjaPdGZ2y9WACViL4L"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB",
                extendedPrivateKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0",
                extendedPubkey: "xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH",
                extendedPrivateKey: "xprv9vHkqa6EV4sPZHYqZznhT2NPtPCjKuDKGY38FBWLvgaDx45zo9WQRUT3dKYnjwih2yJD9mkrocEZXo1ex8G81dwSM1fwqWpWkeS3v86pgKt"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'",
                extendedPubkey: "xpub6ASAVgeehLbnwdqV6UKMHVzgqAG8Gr6riv3Fxxpj8ksbH9ebxaEyBLZ85ySDhKiLDBrQSARLq1uNRts8RuJiHjaDMBU4Zn9h8LZNnBC5y4a",
                extendedPrivateKey: "xprv9wSp6B7kry3Vj9m1zSnLvN3xH8RdsPP1Mh7fAaR7aRLcQMKTR2vidYEeEg2mUCTAwCd6vnxVrcjfy2kRgVsFawNzmjuHc2YmYRmagcEPdU9"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1",
                extendedPubkey: "xpub6DF8uhdarytz3FWdA8TvFSvvAh8dP3283MY7p2V4SeE2wyWmG5mg5EwVvmdMVCQcoNJxGoWaU9DCWh89LojfZ537wTfunKau47EL2dhHKon",
                extendedPrivateKey: "xprv9zFnWC6h2cLgpmSA46vutJzBcfJ8yaJGg8cX1e5StJh45BBciYTRXSd25UEPVuesF9yog62tGAQtHjXajPPdbRCHuWS6T8XA2ECKADdw4Ef"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1/2147483646'",
                extendedPubkey: "xpub6ERApfZwUNrhLCkDtcHTcxd75RbzS1ed54G1LkBUHQVHQKqhMkhgbmJbZRkrgZw4koxb5JaHWkY4ALHY2grBGRjaDMzQLcgJvLJuZZvRcEL",
                extendedPrivateKey: "xprvA1RpRA33e1JQ7ifknakTFpgNXPmW2YvmhqLQYMmrj4xJXXWYpDPS3xz7iAxn8L39njGVyuoseXzU6rcxFLJ8HFsTjSyQbLYnMpCqE2VbFWc"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1/2147483646'/2",
                extendedPubkey: "xpub6FnCn6nSzZAw5Tw7cgR9bi15UV96gLZhjDstkXXxvCLsUXBGXPdSnLFbdpq8p9HmGsApME5hQTZ3emM2rnY5agb9rXpVGyy3bdW6EEgAtqt",
                extendedPrivateKey: "xprvA2nrNbFZABcdryreWet9Ea4LvTJcGsqrMzxHx98MMrotbir7yrKCEXw7nadnHM8Dq38EGfSh6dqA9QWTyefMLEcBYJUuekgW4BYPJcr9E7j"
            });

            await Promise.all(testCases.map(testCase => (async () =>
            {
                try
                {
                    const deriveResult = await WorkerInterface.DeriveBIP32ExtendedKey(testCase.rootKey, testCase.path, "32", false, false);
                    if (deriveResult.type === "err")
                    {
                        Assert(false, `Cannot derive extended key from root key: "${testCase.rootKey}", path: ${testCase.path}`);
                    }
                    else
                    {
                        Assert(deriveResult.result.privateKey !== null, "Could not derive private key");
                        AssertEqual(deriveResult.result.privateKey, testCase.extendedPrivateKey, "Extended private keys don't match");
                        AssertEqual(deriveResult.result.publicKey, testCase.extendedPubkey, "Extended public keys don't match");
                    }
                }
                catch (e)
                {
                    Assert(false, "Unexpected error: " + e.message);
                }

                UpdateProgress();
            })()));
        }

        UpdateProgress();

        await Promise.all([
            TestAddressesAndPrivateKeys(),
            TestBip38(),
            TestBip39(),
            TestBip32()
        ]);

        return failedTestMessages;
    }

    return RunAllTests;
}
