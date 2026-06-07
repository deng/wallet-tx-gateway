# wallet_tx_gateway.api.ChainsApi

## Load the API package
```dart
import 'package:wallet_tx_gateway/api.dart';
```

All URIs are relative to *https://wallet-tx.bithub.pro*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiV1ChainsGet**](ChainsApi.md#apiv1chainsget) | **GET** /api/v1/chains | List supported chains


# **apiV1ChainsGet**
> ApiV1ChainsGet200Response apiV1ChainsGet()

List supported chains

Returns all supported chains with CAIP-2 identifiers and metadata.

### Example
```dart
import 'package:wallet_tx_gateway/api.dart';

final api_instance = ChainsApi();

try {
    final result = api_instance.apiV1ChainsGet();
    print(result);
} catch (e) {
    print('Exception when calling ChainsApi->apiV1ChainsGet: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ApiV1ChainsGet200Response**](ApiV1ChainsGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

