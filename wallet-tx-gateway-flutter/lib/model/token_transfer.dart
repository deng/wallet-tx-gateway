//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TokenTransfer {
  /// Returns a new [TokenTransfer] instance.
  TokenTransfer({
    this.contractAddress,
    this.symbol,
    this.from,
    this.to,
    this.value,
    this.decimals,
  });

  String? contractAddress;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? symbol;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? from;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? to;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? value;

  int? decimals;

  @override
  bool operator ==(Object other) => identical(this, other) || other is TokenTransfer &&
    other.contractAddress == contractAddress &&
    other.symbol == symbol &&
    other.from == from &&
    other.to == to &&
    other.value == value &&
    other.decimals == decimals;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (contractAddress == null ? 0 : contractAddress!.hashCode) +
    (symbol == null ? 0 : symbol!.hashCode) +
    (from == null ? 0 : from!.hashCode) +
    (to == null ? 0 : to!.hashCode) +
    (value == null ? 0 : value!.hashCode) +
    (decimals == null ? 0 : decimals!.hashCode);

  @override
  String toString() => 'TokenTransfer[contractAddress=$contractAddress, symbol=$symbol, from=$from, to=$to, value=$value, decimals=$decimals]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.contractAddress != null) {
      json[r'contractAddress'] = this.contractAddress;
    } else {
      json[r'contractAddress'] = null;
    }
    if (this.symbol != null) {
      json[r'symbol'] = this.symbol;
    } else {
      json[r'symbol'] = null;
    }
    if (this.from != null) {
      json[r'from'] = this.from;
    } else {
      json[r'from'] = null;
    }
    if (this.to != null) {
      json[r'to'] = this.to;
    } else {
      json[r'to'] = null;
    }
    if (this.value != null) {
      json[r'value'] = this.value;
    } else {
      json[r'value'] = null;
    }
    if (this.decimals != null) {
      json[r'decimals'] = this.decimals;
    } else {
      json[r'decimals'] = null;
    }
    return json;
  }

  /// Returns a new [TokenTransfer] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TokenTransfer? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "TokenTransfer[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "TokenTransfer[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TokenTransfer(
        contractAddress: mapValueOfType<String>(json, r'contractAddress'),
        symbol: mapValueOfType<String>(json, r'symbol'),
        from: mapValueOfType<String>(json, r'from'),
        to: mapValueOfType<String>(json, r'to'),
        value: mapValueOfType<String>(json, r'value'),
        decimals: mapValueOfType<int>(json, r'decimals'),
      );
    }
    return null;
  }

  static List<TokenTransfer> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TokenTransfer>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TokenTransfer.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TokenTransfer> mapFromJson(dynamic json) {
    final map = <String, TokenTransfer>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TokenTransfer.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TokenTransfer-objects as value to a dart map
  static Map<String, List<TokenTransfer>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<TokenTransfer>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TokenTransfer.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

