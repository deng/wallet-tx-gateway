//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ApiV1TransactionsPostRequest {
  /// Returns a new [ApiV1TransactionsPostRequest] instance.
  ApiV1TransactionsPostRequest({
    required this.address,
    required this.chain,
    this.skip,
    this.limit,
    this.type,
    this.contractAddress,
  });

  /// Wallet address
  String address;

  /// CAIP-2 chain identifier
  String chain;

  /// Number of records to skip (default: 0)
  int? skip;

  /// Max records to return (default: 20, max: 50)
  int? limit;

  /// Filter by transaction type
  ApiV1TransactionsPostRequestTypeEnum? type;

  /// Filter by token contract address
  String? contractAddress;

  @override
  bool operator ==(Object other) => identical(this, other) || other is ApiV1TransactionsPostRequest &&
    other.address == address &&
    other.chain == chain &&
    other.skip == skip &&
    other.limit == limit &&
    other.type == type &&
    other.contractAddress == contractAddress;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (address.hashCode) +
    (chain.hashCode) +
    (skip == null ? 0 : skip!.hashCode) +
    (limit == null ? 0 : limit!.hashCode) +
    (type == null ? 0 : type!.hashCode) +
    (contractAddress == null ? 0 : contractAddress!.hashCode);

  @override
  String toString() => 'ApiV1TransactionsPostRequest[address=$address, chain=$chain, skip=$skip, limit=$limit, type=$type, contractAddress=$contractAddress]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'address'] = this.address;
      json[r'chain'] = this.chain;
    if (this.skip != null) {
      json[r'skip'] = this.skip;
    } else {
      json[r'skip'] = null;
    }
    if (this.limit != null) {
      json[r'limit'] = this.limit;
    } else {
      json[r'limit'] = null;
    }
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.contractAddress != null) {
      json[r'contractAddress'] = this.contractAddress;
    } else {
      json[r'contractAddress'] = null;
    }
    return json;
  }

  /// Returns a new [ApiV1TransactionsPostRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ApiV1TransactionsPostRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ApiV1TransactionsPostRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ApiV1TransactionsPostRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ApiV1TransactionsPostRequest(
        address: mapValueOfType<String>(json, r'address')!,
        chain: mapValueOfType<String>(json, r'chain')!,
        skip: mapValueOfType<int>(json, r'skip'),
        limit: mapValueOfType<int>(json, r'limit'),
        type: ApiV1TransactionsPostRequestTypeEnum.fromJson(json[r'type']),
        contractAddress: mapValueOfType<String>(json, r'contractAddress'),
      );
    }
    return null;
  }

  static List<ApiV1TransactionsPostRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiV1TransactionsPostRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiV1TransactionsPostRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiV1TransactionsPostRequest> mapFromJson(dynamic json) {
    final map = <String, ApiV1TransactionsPostRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiV1TransactionsPostRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ApiV1TransactionsPostRequest-objects as value to a dart map
  static Map<String, List<ApiV1TransactionsPostRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ApiV1TransactionsPostRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ApiV1TransactionsPostRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'address',
    'chain',
  };
}

class ApiV1TransactionsPostRequestTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const ApiV1TransactionsPostRequestTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const coin = ApiV1TransactionsPostRequestTypeEnum._(r'coin');
  static const token = ApiV1TransactionsPostRequestTypeEnum._(r'token');

  /// List of all possible values in this [enum][ApiV1TransactionsPostRequestTypeEnum].
  static const values = <ApiV1TransactionsPostRequestTypeEnum>[
    coin,
    token,
  ];

  static ApiV1TransactionsPostRequestTypeEnum? fromJson(dynamic value) => ApiV1TransactionsPostRequestTypeEnumTypeTransformer().decode(value);

  static List<ApiV1TransactionsPostRequestTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiV1TransactionsPostRequestTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiV1TransactionsPostRequestTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ApiV1TransactionsPostRequestTypeEnum] to String,
/// and [decode] dynamic data back to [ApiV1TransactionsPostRequestTypeEnum].
class ApiV1TransactionsPostRequestTypeEnumTypeTransformer {
  factory ApiV1TransactionsPostRequestTypeEnumTypeTransformer() => _instance ??= const ApiV1TransactionsPostRequestTypeEnumTypeTransformer._();

  const ApiV1TransactionsPostRequestTypeEnumTypeTransformer._();

  String encode(ApiV1TransactionsPostRequestTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ApiV1TransactionsPostRequestTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ApiV1TransactionsPostRequestTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'coin': return ApiV1TransactionsPostRequestTypeEnum.coin;
        case r'token': return ApiV1TransactionsPostRequestTypeEnum.token;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ApiV1TransactionsPostRequestTypeEnumTypeTransformer] instance.
  static ApiV1TransactionsPostRequestTypeEnumTypeTransformer? _instance;
}
