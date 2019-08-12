"use strict"

/*
 *  Versão 1.1 Release 04/12/2017 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
// The lookup-tables are marked const so they can be placed in read-only storage instead of RAM
// The numbers below can be computed dynamically trading ROM for RAM - 
// This can be useful in (embedded) bootloader applications, where ROM is often limited.
// RAES: Special -> This S-Box to be used hashing the password.
var hashsbox = [
  //0     1    2      3     4    5     6     7      8    9     A      B    C     D     E     F
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16 ];

// This S-Box to be used in BigBlock encoding function.
var bigblock_sbox = [
0x81,0xcf,0xe3,0x9c,0x6c,0x87,0xc4,0xb6,0x57,0xa9,0xa6,0xd2,0x48,0x0c,0xae,0xdb,
0x78,0x8f,0x2b,0x82,0x58,0x15,0xba,0x9b,0x5f,0x30,0x9a,0x9f,0x13,0x26,0xca,0xc2,
0x72,0xfe,0xef,0x11,0x4d,0xe7,0x73,0xdd,0xbc,0xc8,0xd9,0xf3,0x49,0xbb,0xe9,0xc9,
0xdc,0x4a,0x5e,0xc0,0xc6,0x08,0x59,0xb9,0x6a,0x42,0x52,0x3c,0x28,0x80,0xa4,0x0e,
0x8a,0xb8,0x24,0x07,0x90,0x3a,0x04,0x2d,0x33,0x7f,0xd3,0x64,0xf4,0x2c,0x84,0xff,
0xc7,0xd7,0x18,0x44,0xa2,0x7b,0xb0,0x74,0x3d,0x2e,0x94,0xb2,0xcd,0xbe,0xb5,0x76,
0x85,0x61,0xad,0x21,0x14,0x8b,0x05,0x06,0x88,0x8d,0xed,0x23,0xe5,0xaa,0xe6,0xc3,
0x1c,0xf7,0x3f,0xbd,0xab,0x9e,0x54,0xe4,0xa1,0x40,0xa7,0x10,0xfc,0x37,0x31,0xe2,
0x0f,0xa8,0x93,0xd1,0x6d,0xe8,0x3b,0x1f,0x4c,0xf8,0xd6,0x8e,0xf2,0x43,0x8c,0x1a,
0xac,0x83,0x01,0x6f,0x63,0x89,0x1d,0x0D,0xcc,0x86,0x2f,0x62,0xec,0x1e,0x2a,0x71,
0x03,0x35,0x5c,0x5b,0xf0,0x39,0x7a,0xa5,0x29,0x17,0x20,0x79,0x3e,0x69,0x99,0x98,
0x7d,0x5d,0xdf,0xb3,0x68,0x65,0x00,0x0a,0xd5,0xc5,0x16,0x60,0x51,0xbf,0x32,0x6b,
0x36,0x95,0xcb,0x66,0x4e,0x27,0xe1,0x22,0xee,0x5a,0xd4,0xf5,0x09,0x91,0xa3,0xb7,
0x38,0x41,0xde,0x47,0xaf,0x56,0x77,0x70,0x02,0x4b,0x7e,0xf9,0x25,0x12,0x6e,0x0b,
0x67,0xc1,0xfa,0xb1,0xfb,0xd0,0x7c,0xd8,0xf1,0x19,0x96,0xce,0x46,0x92,0x4f,0xda,
0x9d,0x1b,0x75,0x45,0x53,0xe0,0xea,0xf6,0xfd,0xb4,0x55,0xa0,0x34,0xeb,0x97,0x50 ];

// This S-Box to be used in BigBlock decoding function.
var bigblock_inv_sbox = [
0xb6,0x92,0xd8,0xa0,0x46,0x66,0x67,0x43,0x35,0xcc,0xb7,0xdf,0x0D,0x97,0x3f,0x80,
0x7b,0x23,0xdd,0x1c,0x64,0x15,0xba,0xa9,0x52,0xe9,0x8f,0xf1,0x70,0x96,0x9d,0x87,
0xaa,0x63,0xc7,0x6b,0x42,0xdc,0x1d,0xc5,0x3c,0xa8,0x9e,0x12,0x4d,0x47,0x59,0x9a,
0x19,0x7e,0xbe,0x48,0xfc,0xa1,0xc0,0x7d,0xd0,0xa5,0x45,0x86,0x3b,0x58,0xac,0x72,
0x79,0xd1,0x39,0x8d,0x53,0xf3,0xec,0xd3,0x0c,0x2c,0x31,0xd9,0x88,0x24,0xc4,0xee,
0xff,0xbc,0x3a,0xf4,0x76,0xfa,0xd5,0x08,0x14,0x36,0xc9,0xa3,0xa2,0xb1,0x32,0x18,
0xbb,0x61,0x9b,0x94,0x4b,0xb5,0xc3,0xe0,0xb4,0xad,0x38,0xbf,0x04,0x84,0xde,0x93,
0xd7,0x9f,0x20,0x26,0x57,0xf2,0x5f,0xd6,0x10,0xab,0xa6,0x55,0xe6,0xb0,0xda,0x49,
0x3d,0x00,0x13,0x91,0x4e,0x60,0x99,0x05,0x68,0x95,0x40,0x65,0x8e,0x69,0x8b,0x11,
0x44,0xcd,0xed,0x82,0x5a,0xc1,0xea,0xfe,0xaf,0xae,0x1a,0x17,0x03,0xf0,0x75,0x1b,
0xfb,0x78,0x54,0xce,0x3e,0xa7,0x0a,0x7a,0x81,0x09,0x6d,0x74,0x90,0x62,0x0e,0xd4,
0x56,0xe3,0x5b,0xb3,0xf9,0x5e,0x07,0xcf,0x41,0x37,0x16,0x2d,0x28,0x73,0x5d,0xbd,
0x33,0xe1,0x1f,0x6f,0x06,0xb9,0x34,0x50,0x29,0x2f,0x1e,0xc2,0x98,0x5c,0xeb,0x01,
0xe5,0x83,0x0b,0x4a,0xca,0xb8,0x8a,0x51,0xe7,0x2a,0xef,0x0f,0x30,0x27,0xd2,0xb2,
0xf5,0xc6,0x7f,0x02,0x77,0x6c,0x6e,0x25,0x85,0x2e,0xf6,0xfd,0x9c,0x6a,0xc8,0x22,
0xa4,0xe8,0x8c,0x2b,0x4c,0xcb,0xf7,0x71,0x89,0xdb,0xe2,0xe4,0x7c,0xf8,0x21,0x4f ];

// The round constant word array, Rcon[i], contains the values given by 
// x to th e power (i-1) being powers of x (x is denoted as {02}) in the field GF(2^8)
// Note that i starts at 1, not 0).
var Rcon = [
  0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 
  0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 
  0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 
  0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 
  0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 
  0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 
  0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 
  0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 
  0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 
  0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 
  0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 
  0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 
  0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 
  0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 
  0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 
  0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb  ];

// The lookup-tables are marked const so they can be placed in read-only storage instead of RAM
// The numbers below can be computed dynamically trading ROM for RAM - 
// This can be useful in (embedded) bootloader applications, where ROM is often limited.
// RAES: Special S-Box!
var raes_sbox =   [
  //0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F
    1,  11, 254,   9,  25,  17,   3,   7,  15,  23,  20,   5,  21,  12,   2, 237,
  100,  68,   6, 194, 150, 218,  90, 190, 124, 122, 250, 123, 114, 163, 130, 174,
  211, 117,  80, 140, 173,  74, 249, 154, 243,  55, 164,  79,  99,  42, 106,  65,
   29, 178, 126,  81,  88,   8, 148, 180, 187, 153, 102, 214, 189, 109, 171,  45,
  170,  41, 149, 121, 144, 228,  84,  70, 240, 217,  56,  49,  87, 108, 125,  96,
   97,  48,  14, 209,  37, 235, 131, 152, 206,  28, 205, 146, 225,  67, 213, 116,
  246,  89, 151, 119,  52,  50, 220,  44,  59, 196, 203, 165, 147, 160, 155, 177,
  127,  78,  36, 115, 105, 133,  91, 103,  95,  54, 234, 188,  85, 229,  38, 255,
   26, 107, 182, 168,  82, 192,  61, 239, 132, 129, 212, 238,  32,  62,  31,  33,
  167,  73, 236,  76,  46, 221, 161, 197, 247, 156,  35, 172, 143, 253,  93, 248,
  241, 134,  58, 142, 207, 183, 111, 245, 112, 251,  10, 204, 138, 162, 200, 184,
   40,  47, 242,  69,  83,  51, 252,  43, 179, 226, 186, 215, 208,  71, 231, 135,
  233, 232,  53, 159,  57,  75,   0,  30, 139, 199, 113, 158, 104, 185,  64, 176,
   39, 201, 224, 101, 110, 230,  94, 223, 195, 181, 157,  63,  13, 219,  27, 169,
   22, 120,  16, 202, 198,  86,  66, 227, 191, 128,   4, 166, 193, 244, 137,  77,
  210, 136, 175, 118, 216,  34, 222,  24,  19, 141, 145,  92,  18,  60,  98,  72 ];

// RAES: Special reverse S-Box
var raes_rsbox =  [
  //0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F
  198,   0,  14,   6, 234,  11,  18,   7,  53,   3, 170,   1,  13, 220,  82,   8,
  226,   5, 252, 248,  10,  12, 224,   9, 247,   4, 128, 222,  89,  48, 199, 142,
  140, 143, 245, 154, 114,  84, 126, 208, 176,  65,  45, 183, 103,  63, 148, 177,
   81,  75, 101, 181, 100, 194, 121,  41,  74, 196, 162, 104, 253, 134, 141, 219,
  206,  47, 230,  93,  17, 179,  71, 189, 255, 145,  37, 197, 147, 239, 113,  43,
   34,  51, 132, 180,  70, 124, 229,  76,  52,  97,  22, 118, 251, 158, 214, 120,
   79,  80, 254,  44,  16, 211,  58, 119, 204, 116,  46, 129,  77,  61, 212, 166,
  168, 202,  28, 115,  95,  33, 243,  99, 225,  67,  25,  27,  24,  78,  50, 112,
  233, 137,  30,  86, 136, 117, 161, 191, 241, 238, 172, 200,  35, 249, 163, 156,
   68, 250,  91, 108,  54,  66,  20,  98,  87,  57,  39, 110, 153, 218, 203, 195,
  109, 150, 173,  29,  42, 107, 235, 144, 131, 223,  64,  62, 155,  36,  31, 242,
  207, 111,  49, 184,  55, 217, 130, 165, 175, 205, 186,  56, 123,  60,  23, 232,
  133, 236,  19, 216, 105, 151, 228, 201, 174, 209, 227, 106, 171,  90,  88, 164,
  188,  83, 240,  32, 138,  94,  59, 187, 244,  73,  21, 221, 102, 149, 246, 215,
  210,  92, 185, 231,  69, 125, 213, 190, 193, 192, 122,  85, 146,  15, 139, 135,
   72, 160, 178,  40, 237, 167,  96, 152, 159,  38,  26, 169, 182, 157,   2, 127 ];
 
 
 var cb64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
 
 
/* Input:  text in utf-16 (default in javascript) */
/* Return: integer string in base10 from input string converted to utf-8 */
function rui_str2dec(in_text)
{
	var i = 0,
		ret,
	    n_base,
	    n_numb,
	    my_array = rui_str2bytearray(in_text);
	
	ret    = int2bigInt(  0,1,1);
	n_base = int2bigInt(256,1,1);
	n_numb = int2bigInt(  1,1,1);
	
	var L = my_array.length;
	for (i=0; i<L ; i++) {
		ret = add(ret, mult(n_numb,int2bigInt(my_array[i],1,1)));
		n_numb = mult(n_numb, n_base)
	}
	
	return bigInt2str(ret,10);
}

/* Input:  integer string in base10 */
/* Return: text in utf-16 (default in javascript) */
function rui_dec2str(in_dec)
{
	var i = 0,
		ret = "",
	    x, y, q, r,
	    c1, c2, c3, c4, cc;
	
	x = str2bigInt(in_dec,10,1);
	y = int2bigInt(256,10,1);
	q = dup(x);
	r = dup(x);

	while (!isZero(x)) {
		divide_(x,y,q,r);
		copy_(x, q);
		c1 = r[0];
		if ( c1 < 128 ) {
			ret+=String.fromCharCode(c1);
		} else {
			if ((c1 & 0xE0) == 0xC0) { //twobytes utf8
				divide_(x,y,q,r);
				copy_(x, q);
				c2 = r[0];
				if ((c2 & 0xC0) == 0x80) 
					ret+=String.fromCharCode( (c2 & 0x3F) | ((c1 & 0x1F) << 6));
				else
					throw Error("rui_dec2str: Err1 Invalid continuation byte");
			} else {
				if ((c1 & 0xF0) == 0xE0) { //threebytes utf8
					divide_(x,y,q,r);
					copy_(x, q);
					c2 = r[0];
					divide_(x,y,q,r);
					copy_(x, q);
					c3 = r[0];
					if (((c2 & 0xC0) == 0x80) && ((c3 & 0xC0) == 0x80)) 
						ret+=String.fromCharCode( (c3 & 0x3F) | ((c2 & 0x3F) << 6) | ((c1 & 0xF) << 12));
					else
						throw Error("rui_dec2str: Err2 Invalid continuation byte");
					
				} else {
					if ((c1 & 0xF8) == 0xF0) { //fourbytes utf8
						divide_(x,y,q,r);
						copy_(x, q);
						c2 = r[0];
						divide_(x,y,q,r);
						copy_(x, q);
						c3 = r[0];
						divide_(x,y,q,r);
						copy_(x, q);
						c4 = r[0];
						if (((c2 & 0xC0) == 0x80) && ((c3 & 0xC0) == 0x80) && ((c4 & 0xC0) == 0x80)) {
							cc = (c4 & 0x3F) | ((c3 & 0x3F) << 6) | ((c2 & 0x3F) << 12) | ((c1 & 0x7) << 18);
							cc-= 0x10000;
							ret+=String.fromCharCode( (cc >> 10) | 0xd800 ) + String.fromCharCode( (cc & 0x3FF) | 0xDc00);
						} else
							throw Error("rui_dec2str: Err3 Invalid continuation byte");
					}
				}
			}
		}
	}
	
	return (ret);
}

/* Input:  integer string in base10 */
/* Return: same integer in string base 256 (braille characters) */
function rui_encodebraille(in_dec)
{
	var x = str2bigInt(in_dec,10,2);
	var y = str2bigInt("256",10,2);
	var q = new Array(x.length); // bi_copyInt_(q,0);
	var r = new Array(x.length); // bi_copyInt_(r,0);
	var ret="";
	var hex="";

	while (!isZero(x)) {
		divide_(x,y,q,r);
		ret+=String.fromCharCode(r[0] + 10240)
		copy_(x, q);
	}
	if (ret.length==0)
		ret=String.fromCharCode(10240);
	return (ret);
}

/* Input:  integer string in base10 */
/* Return: same integer in string base 20480 (Chinese characters) */
function rui_encodeCJK(in_dec)
{
	var x = str2bigInt(in_dec,10,2);
	var y = str2bigInt("20480",10,2);
	var q = new Array(x.length); // bi_copyInt_(q,0);
	var r = new Array(x.length); // bi_copyInt_(r,0);
	var ret="";
	var hex="";

	while (!isZero(x)) {
		divide_(x,y,q,r);
		ret+=String.fromCharCode(r[0] + 19968)
		copy_(x, q);
	}
	if (ret.length==0)
		ret=String.fromCharCode(19968);
	return (ret);
}

/* Input:  integer string in base 20480 (Chinese characters) */
/* Return: same integer in string base 10 */
function rui_decodeCJK(in_str)
{
	var i = 0,
		ret,
	    n_base,
	    n_numb, byt;
	
	ret    = int2bigInt(  0,1,1);
	n_base = int2bigInt(20480,1,1);
	n_numb = int2bigInt(  1,1,1);
	
	var L = in_str.length;
	for (i=0; i<L ; i++) {
		byt = in_str.charCodeAt(i);
		if (byt >= 19968 && byt < 19968+20480) {
			ret = add(ret, mult(n_numb,int2bigInt(byt - 19968,1,1)));
			n_numb = mult(n_numb, n_base)
		}
	}
	
	return bigInt2str(ret,10);
}

/* Input:  integer string in base 10 */
/* Return: same integer in string base 16 (hexadecimal) */
function rui_decahex(in_str)
{
	var x = str2bigInt(in_str,10,2);
	var y = str2bigInt("256",10,2);
	var q = new Array(x.length); // bi_copyInt_(q,0);
	var r = new Array(x.length); // bi_copyInt_(r,0);
	var ret="";
	var hex="";

	while (!isZero(x)) {
		divide_(x,y,q,r);
		copy_(x, q);
		if (r[0]<16)
			ret = "0" + r[0].toString(16) + ret;
		else
			ret = r[0].toString(16) + ret;
	}
	if (ret.length==0)
		ret="0";
	return ret;
}

/* Input:  integer: length of random number */
/* Return: random integer string in base10 with length of input */
function rui_genRandomNumbers(len)
{
	var ret = "", i, rnd;
	var PAD = "000000000";
	
	var cryptoObject = null, x, padd, ret;
	var x = new Uint32Array(1);

	if ("crypto" in window)
		cryptoObject = crypto;
	else if ("msCrypto" in window)
		cryptoObject = msCrypto;

	for (i=0; i<len; i+=9)
	{
		if (cryptoObject != null ) {
			cryptoObject.getRandomValues(x);
			rnd = x[0] % 1000000000;
		} else
			rnd = Math.floor(Math.random() * 10000000000) % 1000000000;
		ret += PAD.substring(0, 9 - rnd.toString().length) + rnd.toString();
	}
	
	return ret.substring(0,len);

}

/* Input:  integer: length of array */
/* Return: array of pseudorandom bytes with length of input */
function rui_genRandomArray()
{
	var ret = [], i;
	var x = new Uint8Array(16);
	var cryptoObject = null;

	if ("crypto" in window)
		cryptoObject = crypto;
	else if ("msCrypto" in window)
		cryptoObject = msCrypto;

	if (cryptoObject != null ) {
		cryptoObject.getRandomValues(x);
		for (i=0; i<16; i++)
			ret[i] = x[i];
		return (ret);
	}

	var debug = Date.now() + rui_genRandomNumbers(10);
	
	return (rui_hash(debug));
}

function rui_bytearray2hex(input) {
	
	var ret = input.map(function(i) {
			if (i < 16)
				return("0" + i.toString(16));
			else
				return(i.toString(16));} ).join("");
	return(ret);
}

/* converts a string to byte array -> index 0 to n */
/* it takes as input utf-16 chars (default in javascript) and encode it as utf-8 */
function rui_str2bytearray(mytext)
{
	var byarr = [];
	
	var c,c1, i;
	
	for (i=0; i<mytext.length; i++) {
		c = mytext.charCodeAt(i);
		
		if (c < 128)
			byarr.push(c);
		else {
			if (c < 2048) {
				byarr.push(c>>6 | 0xc0);    //ok
				byarr.push((c & 63) | 128); //ok
			} else {
				if (c < 55296 || c > 57343) {
					byarr.push(((c >> 12 ) & 63) | 0xe0); //ok
					byarr.push(((c >> 6 ) & 63) | 128); //ok
					byarr.push((c & 63) | 128); //ok
				} else {
					i++;
					c1 = mytext.charCodeAt(i);
					if ((c & 0xFC00) == 0xd800 && (c1 & 0xFC00) == 0xDC00) {
						c = ((c & 0x3FF) << 10) + (c1 & 0x3FF) + 0x10000;
						byarr.push(((c >> 18 ) & 63) | 0xf0); //ok
						byarr.push(((c >> 12 ) & 63) | 128); //ok
						byarr.push(((c >> 6 ) & 63) | 128); //ok
						byarr.push((c & 63) | 128); //ok
					}
				}
				
			}
		}
	}
	return (byarr);
}


/* Input:  byte array */
/* Return: same content in string base 256 (braille characters) */
function rui_encode_b_braille(in_b_arr)
{
	var ret="", i;

	for (i=0; i< in_b_arr.length; i++)
		if (i != 0 && i % 60 == 0)
			ret+="\n" + String.fromCharCode(in_b_arr[i] + 10240);
		else
			ret+=String.fromCharCode(in_b_arr[i] + 10240);

	if (i==0)
		ret=String.fromCharCode(10240);

	return (ret);
}

/* Input:  string in braille */
/* Return: byte array  */
function rui_decode_b_braille(in_str)
{
	var ret=[], i;
	
	in_str = in_str.replace(/[^⠀-⣿]/g, '');

	for (i=0; i< in_str.length; i++)
		ret[i]= in_str.charCodeAt(i) - 10240;

	return (ret);
}

/* Input:  Byte arrays (message and password) */
/* Return: byte array decoded */
function rui_dec_bigblock(b_msg, b_senha) {
	
	var i, k, temp, temp2, L;
	var zer = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var keys, step, pass_expansion;

	keys = rui_keysch_bigblock(b_senha);

	//xor last key
	pass_expansion = keys[8].slice(0);;
	temp = pass_expansion.concat(b_msg);
	temp2 = [];
	for (i=16, L=temp.length; i<L; i++) {
		pass_expansion[i] = pass_expansion[i-16] ^ pass_expansion[i-14] ^ pass_expansion[i-13] ^ pass_expansion[i-10] ^ pass_expansion[i-6];
		temp2[i]= temp[i] ^ temp[i-1] ^ temp[i-3] ^ temp[i-4] ^ temp[i-7] ^ temp[i-11] ^ pass_expansion[i];
	}

	temp2.splice(0,16);

	//loop for passes
	for (k=7; k>=0; k--) {
		//alternate permutation
		temp = [];
		for (i=0, L=temp2.length; i< L; i++) {
			if (L % 2 == 0)
				if (i % 2 == 1)
					if (i == L - 1 )
						temp[i] = temp2[i];
					else
						temp[i] = temp2[L-i-2];
				else
					temp[i] = temp2[i];
			else
				if (i % 2 == 0)
					temp[i] = temp2[i];
				else
					temp[i] = temp2[L-i-1];
		}

		//rotate 
		L = temp.length;
		if ( L >15 ) {
			switch (k) {
				case 0:
				case 7:
					step = Math.floor(L/2);
					break;
				case 1:
					step = Math.floor(L/3);
					break;
				case 3:
					step = Math.floor(L/5);
					break;
				case 4:
				case 5:
					step = Math.floor(L/7);
					break;
				default: //k = 6 and 2
					step = Math.floor(L/11);
			}
		}
		temp2 = temp.splice(L - step, step);
		temp = temp2.concat(temp);
		
		//inv-sbox
		temp2 = temp.map(function(i) {
			return(bigblock_inv_sbox[i]); } );

		//internal xor
		temp2 = zer.concat(temp2);
		for (i=16, L=temp2.length; i<L; i++) {
			temp[i]= temp2[i] ^ temp2[i-1] ^ temp2[i-3] ^ temp2[i-4] ^ temp2[i-7] ^ temp2[i-11]; 
		}
		temp.splice(0,16);

		//reverse add passw
		pass_expansion = keys[k].slice(0);;
		temp = pass_expansion.concat(temp.reverse());
		for (i=16, L=temp.length; i<L; i++) {
			pass_expansion[i] = pass_expansion[i-16] ^ pass_expansion[i-14] ^ pass_expansion[i-13] ^ pass_expansion[i-10] ^ pass_expansion[i-6];
			temp2[i]= temp[i] ^ temp[i-1] ^ temp[i-3] ^ temp[i-4] ^ temp[i-7] ^ temp[i-11] ^ pass_expansion[i];
		}
		temp2.splice(0,16);

	}
	
	if (temp2.length == 24 ) { //message was padded
		for (k = 0; k<24;  k++)
			if ( temp2[k] == 0 ) {
				temp2 = temp2.slice(0, k);
				break;
			}
	}
	
	return(temp2);
}

/* Input:  byte arrays (message and password) */
/* Return: byte array encoded  */
function rui_enc_bigblock(b_msg, b_senha) {

	var zer = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], rnd;
	var temp2, temp, keys, i, k, step, pass_expansion, L;

	if (b_msg.length < 24) {
		b_msg.push(0);
		for (i=0, rnd = rui_genRandomArray().concat(rui_genRandomArray()); b_msg.length < 24; i++)
			b_msg.push( rnd[i] );
	}

	keys = rui_keysch_bigblock(b_senha);
	temp = b_msg.slice(0);
	
	//loop
	for (k=0; k<8; k++) {
		pass_expansion = keys[k].slice(0);
		temp = pass_expansion.concat(temp);
		L=temp.length;
		temp2=temp.slice(0);
		//xor key
		for (i=16; i<L; i++) {
			pass_expansion[i] = pass_expansion[i-16] ^ pass_expansion[i-14] ^ pass_expansion[i-13] ^ pass_expansion[i-10] ^ pass_expansion[i-6];
			temp2[i]= temp[i] ^ temp2[i-1] ^ temp2[i-3] ^ temp2[i-4] ^ temp2[i-7] ^ temp2[i-11] ^ pass_expansion[i]; 
		}
		temp2.splice(0,16);

		//reverse
		temp2 = temp2.reverse();
		
		//internal xor
		temp2 = zer.concat(temp2);
		for (i=16; i<L; i++) {
			temp2[i]= temp2[i] ^ temp2[i-1] ^ temp2[i-3] ^ temp2[i-4] ^ temp2[i-7] ^ temp2[i-11]; 
		}
		temp2.splice(0,16);
		
		//sbox
		temp2 = temp2.map(function(i) {
			return(bigblock_sbox[i]); } );
		
		//rotate 
		L = temp2.length;
		if ( L >15 ) {
			switch (k) {
				case 0:
				case 7:
					step = Math.floor(L/2);
					break;
				case 1:
					step = Math.floor(L/3);
					break;
				case 3:
					step = Math.floor(L/5);
					break;
				case 4:
				case 5:
					step = Math.floor(L/7);
					break;
				default: //k = 6 and 2
					step = Math.floor(L/11);
			}
		}
		temp = temp2.splice(0, step);
		temp2 = temp2.concat(temp);
		
		//alternate permutation
		temp = [];
		L=temp2.length;
		for (i=0; i< L; i++) {
			if (L % 2 == 0)
				if (i % 2 == 1)
					if (i == L - 1 )
						temp[i] = temp2[i];
					else
						temp[i] = temp2[L-i-2];
				else
					temp[i] = temp2[i];
			else
				if (i % 2 == 0)
					temp[i] = temp2[i];
				else
					temp[i] = temp2[L-i-1];
		}

	}

	//xor last key
	pass_expansion = keys[k].slice(0);
	temp = pass_expansion.concat(temp);
	L=temp.length;
	temp2=temp.slice(0);
	for (i=16; i<L; i++) {
		pass_expansion[i] = pass_expansion[i-16] ^ pass_expansion[i-14] ^ pass_expansion[i-13] ^ pass_expansion[i-10] ^ pass_expansion[i-6];
		temp2[i]= temp[i] ^ temp2[i-1] ^ temp2[i-3] ^ temp2[i-4] ^ temp2[i-7] ^ temp2[i-11] ^ pass_expansion[i]; 
	}
	temp2.splice(0,16);

	return(temp2);

}

/* Input:  byte array of string encoded in UTF-8 */
/* Return: string in UTF-16 (default in javascript)  */
function rui_bytearray2str(arr) {
	
	var i, L;
	var c1, c2, c3, c4, cc;
	var ret = "";
	
	try {
		L = arr.length;
		for (i=0; i<L; i++) {
			c1 = arr[i];
			if ( c1 < 128 ) {
				ret+=String.fromCharCode(c1);
			} else {
				if ((c1 & 0xE0) == 0xC0) { //twobytes utf8
					c2 = arr[++i];
					if ((c2 & 0xC0) == 0x80) 
						ret+=String.fromCharCode( (c2 & 0x3F) | ((c1 & 0x1F) << 6));
					else
						throw 1;
				} else {
					if ((c1 & 0xF0) == 0xE0) { //threebytes utf8
						c2 = arr[++i];
						c3 = arr[++i];
						if (((c2 & 0xC0) == 0x80) && ((c3 & 0xC0) == 0x80)) 
							ret+=String.fromCharCode( (c3 & 0x3F) | ((c2 & 0x3F) << 6) | ((c1 & 0xF) << 12));
						else
							throw 2;
						
					} else {
						if ((c1 & 0xF8) == 0xF0) { //fourbytes utf8
							c2 = arr[++i];
							c3 = arr[++i];
							c4 = arr[++i];
							if (((c2 & 0xC0) == 0x80) && ((c3 & 0xC0) == 0x80) && ((c4 & 0xC0) == 0x80)) {
								cc = (c4 & 0x3F) | ((c3 & 0x3F) << 6) | ((c2 & 0x3F) << 12) | ((c1 & 0x7) << 18);
								cc-= 0x10000;
								ret+=String.fromCharCode( (cc >> 10) | 0xd800 ) + String.fromCharCode( (cc & 0x3FF) | 0xDc00);
							} else
								throw 3;
						}
					}
				}
			}
		}
	} catch (e) {
		return("#Error " + e.toString() + ": decoding utf-8 string");
	}
	
	return (ret);
}

/* Input:  primary key (byte array) with 16 bytes */
/* Return: Array of keys (8 item) (key schedule) */
function rui_keysch_bigblock(prim_key) {
    var i,j,k, sh, z;

    var previous= [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var temp    = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var permuta = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var rcon = [0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e ];
    
    var rresult = prim_key.slice(0);
    var ret=[ [] ];
    
    ret[0] = prim_key.slice(0);
    if (prim_key.length != 16)
		return undefined;
		
    for( k=0; k<8; k++)
    {
        for (i=0; i<16; i++)
			temp[i] = rresult[i];
			
		temp[0]^=rcon[k];
		temp[15]^=rcon[k];

        for (i=0; i<8; i++)
            rresult[i] = temp[i+8];

        for (i=8; i<16; i++)
            rresult[i] = hashsbox[temp[i] ^ temp[i-8] ^ previous[i]];
       
        for (j=0; j<8; j++) {
            permuta[j  ]=0;
            permuta[j+8]=0;
            z = ((128 >> j) & 255) | ((128 << (8 - j)) & 255 );
            for (i=0; i<8; i++) {
                if (i-j < 0)
                    sh=i-j+8;
                else
                    sh=i-j;
                permuta[j  ]+= (((rresult[i*2  ]&z) >> sh) & 255) | (((rresult[i*2  ]&z) << (8 - sh)) & 255);
                permuta[j+8]+= (((rresult[i*2+1]&z) >> sh) & 255) | (((rresult[i*2+1]&z) << (8 - sh)) & 255);
            }
        }
        for (i=0; i<16; i++) {
			rresult[i]  = permuta[i];
			previous[i] = temp[i];
		}
		ret[k+1] = rresult.slice(0);
    }
    
    return(ret);
}


/* Input:  text in utf-16 (default in javascript). Any length. */
/* Return: byte array containing the hash (16 bytes) */
function rui_hash(in_text)
{

    var i,j,k, sh, z, i_inp;
    var previous= [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var temp    = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var permuta = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var rresult = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

	//if in_txt is 32 hex chars long, don't hash.
    if ( /^[0-9A-Fa-f]{32}$/g.test(in_text) ) {
		for (i=0; i< 16; i++)
			rresult[i] = parseInt(in_text.slice(2*i, 2*i+2),16);
		return(rresult);
	}
	
    var inp_bytes = rui_str2bytearray(in_text);
    
	for (i=inp_bytes.length % 16; i % 16 !=0 ; i++)
			inp_bytes.push(0);
			
	for (i_inp=0; i_inp<16; i_inp++)
			rresult[i_inp] = inp_bytes[i_inp];

	do {
		for( k=0; k<9; k++)
		{
			for (i=0; i<16; i++) {
				temp[i] = rresult[i];
			}

			for (i=0;i<8;i++)
				rresult[i] = temp[i+8];

			for (i=8;i<16;i++)
				rresult[i] = hashsbox[temp[i] ^ temp[i-8] ^ previous[i]];
		   
			for (j=0;j<8;j++)
			{
				var sh;
				permuta[j  ]=0;
				permuta[j+8]=0;
				z = ((128 >> j) & 255) | ((128 << (8 - j)) & 255 );
				for (i=0; i<8;i++)
				{
					if (i-j < 0)
						sh=i-j+8;
					else
						sh=i-j;
					permuta[j  ]+= (((rresult[i*2  ]&z) >> sh) & 255) | (((rresult[i*2  ]&z) << (8 - sh)) & 255);
					permuta[j+8]+= (((rresult[i*2+1]&z) >> sh) & 255) | (((rresult[i*2+1]&z) << (8 - sh)) & 255);
				}
			}
			for (i=0; i<16; i++) {
				rresult[i]  = permuta[i];
				previous[i] = temp[i];
			}
		}
	
		if (i_inp < inp_bytes.length) {
			for (i=0; i<16; i++) {
				rresult[i]  = rresult[i] ^ inp_bytes[i_inp + i];
				previous[i] = 0;
			}
			i_inp+=16;
		} else {
			break;
		}
	
	} while (1);
	
	return(rresult);
}

/*
** base64encode
**
** encode 16 8-bit binary bytes as 24 '6-bit' characters
*/
function rui_base64encode( bytes_in )
{
    var i, len, len_in = 0;
    var out = "";

    if ( !Array.isArray(bytes_in) )
		return undefined;

	len = bytes_in.length;
	if (len == 0)
		return undefined;

    for (i=0; i<len ; i++) {
        if (i % 3 == 0)
			if (i != 0 && i % 60 == 0) // add \n every 80 chars
				out += "\n" + cb64.charAt( (bytes_in[i] >> 2));
			else
				out += cb64.charAt( (bytes_in[i] >> 2));
        if (i % 3 == 1)
            out += cb64.charAt( ((bytes_in[i-1] & 0x03) << 4) | ((bytes_in[i] & 0xf0) >> 4) );
        if (i % 3 == 2)
            out = out.concat(cb64.charAt( ((bytes_in[i-1] & 0x0f) << 2) | ((bytes_in[i] & 0xc0) >> 6) ) , cb64.charAt( (bytes_in[i] & 0x3f) ) );
    }
    
    if (len % 3 == 1)
        out = out.concat( cb64.charAt( ((bytes_in[i-1] & 0x03) << 4)  ), "==" );
    if (len % 3 == 2)
        out = out.concat( cb64.charAt( ((bytes_in[i-1] & 0x0f) << 2) ), "=");

	return(out);
}


/*
** decodeblock
**
** decode 4 '6-bit' characters into 3 8-bit binary bytes. Any length.
*/
function rui_base64decode( in_b64 )
{  
    var i, len_data, error=0;
    var temp = [], out = [];

	in_b64 = in_b64.replace(/[^a-zA-Z0-9+/=]/g, '');
	
	if (in_b64.length % 4 == 0)
		for (i=0; i<in_b64.length && error == 0; i++)
		{
			if (in_b64.charCodeAt(i)>=65 && in_b64.charCodeAt(i)<=90) // between A and Z
				temp[i]=in_b64.charCodeAt(i)-65;
			else
				if (in_b64.charCodeAt(i)>=97 && in_b64.charCodeAt(i)<=122) // between a and z
					temp[i]=in_b64.charCodeAt(i)-71;
				else
					if (in_b64.charCodeAt(i)>=48 && in_b64.charCodeAt(i)<=57) // between 0 and 9
						temp[i]=in_b64.charCodeAt(i)+4;
					else
						if (in_b64.charAt(i) == "+" )   // +
							temp[i]=62;
						else
							if (in_b64.charAt(i)== "/") // /
								temp[i]=63;
							else             // = or anything else
								if (in_b64.charAt(i)== "=") // =
									temp[i]=0;
								else
									error = 1;
		}
	else
		error = 1;
	

	if (error == 1 )
		return undefined;
	else
	{
		for (i=0, len_data = 0; i<in_b64.length;)
		{
			out[ len_data++ ] = (temp[i] << 2 | temp[i+1] >> 4) & 0xFF;
			i+=2;
			if (in_b64.charAt(i)=='=')
				break;
			out[ len_data++ ] = (temp[i-1] << 4 | temp[i] >> 2) & 0xFF;
			i++;
			if (in_b64.charAt(i)=='=')
				break;
			out[ len_data++ ] = (((temp[i-1] << 6) & 0xc0) | temp[i]) & 0xFF;
			i++;
		}

		return(out);
	}
}

// This function produces Nb(Nr+1) round keys. The round keys are used in each round to decrypt the states. 
function KeyExpansion( key0 )
{
	var i, j, k;
	var tempa = [0, 0, 0, 0]; // Used for the column/row operations
	var key_exp = [];

	var Nb = 4, Nr = 10, Nk = 4;
	
	// The first round key is the key itself.
	for(i = 0; i < 4; ++i)	{
		key_exp[(i * 4) + 0] = key0[(i * 4) + 0];
		key_exp[(i * 4) + 1] = key0[(i * 4) + 1];
		key_exp[(i * 4) + 2] = key0[(i * 4) + 2];
		key_exp[(i * 4) + 3] = key0[(i * 4) + 3];
	}

	// All other round keys are found from the previous round keys.
	for(; (i < (Nb * (Nr + 1))); ++i)
	{
		for(j = 0; j < 4; ++j)
		{
			tempa[j]=key_exp[(i-1) * 4 + j];
		}
		if (i % Nk == 0)
		{
			// This function rotates the 4 bytes in a word to the left once.
			// [a0,a1,a2,a3] becomes [a1,a2,a3,a0]

			// Function RotWord()
			k = tempa[0];
			tempa[0] = tempa[1];
			tempa[1] = tempa[2];
			tempa[2] = tempa[3];
			tempa[3] = k;

			// SubWord() is a function that takes a four-byte input word and 
			// applies the S-box to each of the four bytes to produce an output word.

			// Function Subword()
			tempa[0] = raes_sbox[(tempa[0])];
			tempa[1] = raes_sbox[(tempa[1])];
			tempa[2] = raes_sbox[(tempa[2])];
			tempa[3] = raes_sbox[(tempa[3])];

			tempa[0] =  tempa[0] ^ Rcon[i/Nk];
		}
		else
			if (Nk > 6 && i % Nk == 4)
			{
				// Function Subword()
				tempa[0] = raes_sbox[(tempa[0])];
				tempa[1] = raes_sbox[(tempa[1])];
				tempa[2] = raes_sbox[(tempa[2])];
				tempa[3] = raes_sbox[(tempa[3])];
			}
		key_exp[i * 4 + 0] = key_exp[(i - Nk) * 4 + 0] ^ tempa[0];
		key_exp[i * 4 + 1] = key_exp[(i - Nk) * 4 + 1] ^ tempa[1];
		key_exp[i * 4 + 2] = key_exp[(i - Nk) * 4 + 2] ^ tempa[2];
		key_exp[i * 4 + 3] = key_exp[(i - Nk) * 4 + 3] ^ tempa[3];
	}
	
	return(key_exp);
}

//return the INPUT (string) encoded by the hashed KEY (string, any length) encoded in base_64
// padding 0-> pad with zeros bytes. padding 1 -> one byte added with padding information
function RAES128_ECB_decrypt_b64( input, key_txt, padding)
{
	var cipher_byt, decoded, n=0, temp;
	cipher_byt = rui_base64decode( input );
	
	if (cipher_byt === undefined)
		return ("۞ Is input base64? ۞");

	if (cipher_byt.length != 16)
		return ("۞   Is input base64?    ۞\n۞ Trying to decode CBC? ۞");
				
	decoded = RAES_InvCipher( cipher_byt, rui_hash(key_txt));
	
	decoded = rui_remPad(decoded, padding);
	
	return(rui_bytearray2str(decoded));
}

function RAES_InvCipher(enc_bytes, key_bytes)
{
	var debug, round=10, temp, i, tempArray, j, sh, Tmp,Tm,t, z, a, b,c,d ;
	var state = enc_bytes.slice(0); //duplicate

	if (state.length != 16 )
		return undefined;

	var key_ex = KeyExpansion(key_bytes);
	
	//AddRoundKey 10
	for(i=0;i<16;++i)
		state[i] ^= key_ex[round * 16 + i ];

	// There will be Nr rounds.
	// The first Nr-1 rounds are identical.
	// These Nr-1 rounds are executed in the loop below.
	for(round--;round>=0;round--)
	{
		//InvShiftRows();
			// Rotate first row 1 columns to right  
			temp=state[3*4+1];
			state[3*4+1]=state[2*4+1];
			state[2*4+1]=state[1*4+1];
			state[1*4+1]=state[0*4+1];
			state[0*4+1]=temp;

			// Rotate second row 2 columns to right 
			temp=state[0*4+2];
			state[0*4+2]=state[2*4+2];
			state[2*4+2]=temp;

			temp=state[1*4+2];
			state[1*4+2]=state[3*4+2];
			state[3*4+2]=temp;

			// Rotate third row 3 columns to right
			temp=state[0*4+3];
			state[0*4+3]=state[1*4+3];
			state[1*4+3]=state[2*4+3];
			state[2*4+3]=state[3*4+3];
			state[3*4+3]=temp;
		
		//InvSubBytes();
		// The SubBytes Function Substitutes the values in the
		// state matrix with values in an S-box.
		for(i = 0; i < 16; ++i)
			state[i] = raes_rsbox[state[i]];
			
		
		// skip bitswap in last round
		if (round != 0 ) {
			//bitswap();
			// RAES: Special bit swap function
			// RAES: Simetric function
			tempArray = state.slice(0)
			for (j=0;j<8;j++)
			{
				tempArray[j  ]=0;
				tempArray[j+8]=0;
				z = rotate_8bit_rigth(128,j);
				for (i=0; i<8;i++)
				{
					if (i-j < 0)
						sh=i-j+8;
					else
						sh=i-j;
					tempArray[j  ]+=rotate_8bit_rigth( (state[i  ] & z), sh);
					tempArray[j+8]+=rotate_8bit_rigth( (state[i+8] & z), sh);
				}
			}		
			state = tempArray.slice(0);
		}
		
		//AddRoundKey(round);
		for(i=0;i<16;++i)
			state[i] ^= key_ex[round * 16 + i ];

		// skip InvMixColumns in last round
		if (round != 0 ) {
			//InvMixColumns();
			// MixColumns function mixes the columns of the state matrix.
			// The method used to multiply may be difficult to understand for the inexperienced.
			// Please use the references to gain more information.
			for(i=0;i<4;++i)
			{ 
				a = state[i*4+0];
				b = state[i*4+1];
				c = state[i*4+2];
				d = state[i*4+3];

				state[i*4+0] = Multiply(a, 0x0e) ^ Multiply(b, 0x0b) ^ Multiply(c, 0x0d) ^ Multiply(d, 0x09);
				state[i*4+1] = Multiply(a, 0x09) ^ Multiply(b, 0x0e) ^ Multiply(c, 0x0b) ^ Multiply(d, 0x0d);
				state[i*4+2] = Multiply(a, 0x0d) ^ Multiply(b, 0x09) ^ Multiply(c, 0x0e) ^ Multiply(d, 0x0b);
				state[i*4+3] = Multiply(a, 0x0b) ^ Multiply(b, 0x0d) ^ Multiply(c, 0x09) ^ Multiply(d, 0x0e);
			}
		}
	}
  
	return (state);
}

// return the inp padded (16 bytes).
// Mode == 0 { null terminator  } else { add one byte padding information }
function rui_addPad(inp, mode) {

	var i, rnd;
	
	if (mode == 0) {
		if ( inp.length % 16  != 0 ) {
			inp.push(0);
			for (i=0, rnd = rui_genRandomArray(); inp.length % 16 != 0; i++)
				inp.push( rnd[i] );
		}
	} else
		if (inp.length % 16 == 0 )
			inp = inp.concat( [ 16, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] );
		else {
			inp.push( ( Math.floor(inp.length / 16 )+1) * 16 - inp.length);
			while ( inp.length % 16 != 0 )
				inp.push(0);
		}
		
	return (inp);
}

// remove the padding of inp (16 bytes).
// Mode == 0 { null terminator  } else { add one byte padding information }
function rui_remPad(inp, mode) {

	var n=0, temp;
	
	if (inp.length % 16 != 0 ) //padded inp always multiple of 16
		return undefined;

	if (mode == 0) {
		temp = (inp.length / 16) - 1;
		for (n = 0; n<16;  n++)
			if ( inp[temp * 16 + n] == 0 ) {
				inp = inp.slice(0, temp * 16 + n);
				break;
			}
	} else {
		do {
			if (n>16) //error removing padding.
				return undefined;
			temp = inp.pop();
			n++;
		} while (temp != n);
	}
		
	return (inp);
}	

//return the INPUT (string) encoded by the hashed KEY (string, any length) encoded in base_64
// padding 0-> pad with zeros bytes. padding 1 -> one byte added with padding information
function RAES128_ECB_encrypt_b64( input, key_txt, padding)
{
	var plain_byt = rui_str2bytearray(input);
	var i, rnd;
	
	plain_byt = rui_addPad(plain_byt, padding);

	if (plain_byt.length > 16) //ECB only encodes information <= 15 bytes + 1 byte padding
		return ("۞  Input bigger than 16 bytes. Try CBC! ۞");

	// The next function call encrypts the PlainText with the hashedkey using RAES algorithm.
	var encoded = RAES_Cipher( plain_byt, rui_hash(key_txt));

	// Then finally encode data in base64 notation.
	return (rui_base64encode(encoded));

}

// Multiply is used to multiply numbers in the field GF(2^8)
function Multiply( x, y)
{
	return (((y & 1) * x) ^
       ((y>>1 & 1) * xtime(x)) ^
       ((y>>2 & 1) * xtime(xtime(x))) ^
       ((y>>3 & 1) * xtime(xtime(xtime(x)))) ^
       ((y>>4 & 1) * xtime(xtime(xtime(xtime(x))))));
}

function xtime( x ) {
	return ( ( (x<<1) ^ (((x>>7) & 1) * 0x1b) ) & 0xFF);
}

function rotate_8bit_rigth(x,shift) {
	return ( ( (x >> shift) | (x << (8 - shift)) ) & 0xFF );
}

//Checked and working
//
// plain_bytes must be an array with 16 items below 256
// key_bytes   must be an array with 16 items below 256
// return value is an array with 16 item (encoded data)
function RAES_Cipher( plain_bytes, key_bytes) {
	
	var round = 0;
	var temp, tempArray, i, j, sh, Tmp,Tm,t, z;
	var state = plain_bytes.slice(0); //duplicate
	
	if (state.length != 16 )
		return undefined;
		
	var key_ex = KeyExpansion(key_bytes);
	
	//AddRoundKey(0);
	// Add the First round key to the state before starting the rounds.
	// This function adds (by XOR) the round key to state. -->  
	for(i=0;i<16;++i)
		state[i] ^= key_ex[round * 16 + i ];

	

	for(++round; round <= 10; ++round) {
		//SubBytes();
		// The SubBytes Function Substitutes the values in the
		// state matrix with values in an S-box.
		for(i = 0; i < 16; ++i)
			state[i] = raes_sbox[state[i]];
		
		//ShiftRows();
		// The ShiftRows() function shifts the rows in the state to the left.
		// Each row is shifted with different offset.
		// Offset = Row number. So the first row is not shifted.

			// Rotate first row 1 columns to left  
			temp        = state[1];
			state[1]    = state[4+1];
			state[4+1]  = state[8+1];
			state[8+1]  = state[12+1];
			state[12+1] = temp;

			// Rotate second row 2 columns to left  
			temp       = state[2];
			state[2]   = state[8+2];
			state[8+2] = temp;

			temp        = state[4+2];
			state[4+2]  = state[12+2];
			state[12+2] = temp;

			// Rotate third row 3 columns to left
			temp        = state[3];
			state[3]    = state[12+3];
			state[12+3] = state[8+3];
			state[8+3]  = state[4+3];
			state[4+3]  = temp;
		
		//skip MixColumns in last round
		if (round != 10) {		
			//MixColumns();
			// MixColumns function mixes the columns of the state matrix
			for(i = 0; i < 4; ++i) {  
				t   = state[i*4+0];
				Tmp = state[i*4+0] ^ state[i*4+1] ^ state[i*4+2] ^  state[i*4+3] ;
				Tm  = state[i*4+0] ^ state[i*4+1] ; Tm = xtime(Tm); state[i*4+0] ^= Tm ^ Tmp ;
				Tm  = state[i*4+1] ^ state[i*4+2] ; Tm = xtime(Tm); state[i*4+1] ^= Tm ^ Tmp ;
				Tm  = state[i*4+2] ^ state[i*4+3] ; Tm = xtime(Tm); state[i*4+2] ^= Tm ^ Tmp ;
				Tm  = state[i*4+3] ^ t ;            Tm = xtime(Tm); state[i*4+3] ^= Tm ^ Tmp ;
			}
		}
		
		//AddRoundKey(round);
		for(i=0;i<16;++i)
			state[i] ^= key_ex[round * 16 + i ];

		//skip bitswap in last round
		if (round != 10) {
			//bitswap();
			// RAES: Special bit swap function
			// RAES: Simetric function
			tempArray = state.slice(0)
			for (j=0;j<8;j++)
			{
				tempArray[j  ]=0;
				tempArray[j+8]=0;
				z = rotate_8bit_rigth(128,j);
				for (i=0; i<8;i++)
				{
					if (i-j < 0)
						sh=i-j+8;
					else
						sh=i-j;
					tempArray[j  ]+=rotate_8bit_rigth( (state[i  ] & z), sh);
					tempArray[j+8]+=rotate_8bit_rigth( (state[i+8] & z), sh);
				}
			}		
			state = tempArray.slice(0);
		}

	}

	return(state);
}

//return the INPUT (string) encoded by the hashed KEY (string, any length) encoded in base_64
// padding 0-> pad with zeros bytes. padding 1 -> one byte added with padding information
function RAES128_CBC_encrypt_b64( input, key_txt, padding)
{
	var encoded = rui_genRandomArray(); //first block of random data
	var i, j, total_blocks, key_byt, block_byt;
	
	var plain_byt = rui_str2bytearray(input);
	
	plain_byt = rui_addPad(plain_byt, padding);
	
	total_blocks = plain_byt.length / 16;
	key_byt = rui_hash(key_txt);

	for (i=0; i< total_blocks; i++) {
		block_byt = plain_byt.slice(i*16, (i+1)*16);
		//XOR with anterior ciphertext
		for (j=0; j< 16; j++)
			block_byt[j] ^= encoded[i*16+j];
		
		encoded = encoded.concat(RAES_Cipher( block_byt, key_byt));
	}

	// Then finally encode data in base64 notation.
	return (rui_base64encode(encoded));

}

// return the INPUT (string encoded in base64) decoded by the hashed KEY (string, any length)
// padding 0-> pad with zeros bytes. padding 1 -> one byte added with padding information
function RAES128_CBC_decrypt_b64( input, key_txt, padding)
{
	var cipher_byt, block_byt, decoded, n=0, temp, total_blocks, key_byt, i, j, n;
	var plain_byt = [];
	cipher_byt = rui_base64decode( input );
	
	if (cipher_byt === undefined)
		return ("۞ Is input base64? ۞");
	
	if (cipher_byt.length / 16 == 1)
		return ("۞ Trying to decode ECB? ۞");
		
	if (cipher_byt.length % 16 != 0)
		return ("۞ Is input base64? ۞");

	total_blocks = cipher_byt.length / 16;
	key_byt = rui_hash(key_txt);
	
	//discard first block
	for (i=1; i< total_blocks; i++) {
		block_byt = cipher_byt.slice(i*16, (i+1)*16);
		decoded = RAES_InvCipher( block_byt, key_byt);
		//XOR with anterior ciphertext
		for (j=0; j< 16; j++)
			decoded[j] ^= cipher_byt[(i-1)*16+j];
		plain_byt = plain_byt.concat(decoded);
	}
	
	plain_byt = rui_remPad(plain_byt, padding);
	
	return(rui_bytearray2str(plain_byt));
}
