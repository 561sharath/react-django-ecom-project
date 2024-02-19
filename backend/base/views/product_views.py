from django.shortcuts import render
from django.http import JsonResponse
from base.products import products
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from base.models import Product,Review
from base.serializers import ProductSerializer,UserSerializer,UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.core.paginator import Paginator,EmptyPage,PageNotAnInteger
# Create your views here.

'''@api_view(['GET'])
def getRoutes(request):

    routes=[
        'api/irfhuh',
        'api/oifhriuhf',
    ]
    return Response(routes)'''



@api_view(['GET'])
def getProducts(request):
    query=request.query_params.get('keyword')
    print(query,'query')
    
    if query == None or query=='null':
        query=''
    products=Product.objects.filter(name__icontains=query)
    
    page = request.query_params.get('page')
    print(page,'page')
    paginator = Paginator(products,4)
    
    
    
    try:
        products = paginator.page(page)
        
    except PageNotAnInteger:
        products = paginator.page(1)
        
    except EmptyPage:
        
        products = paginator.page(paginator.num_pages)
        
    if page== None or page=='null':
        page=1
        
    page=int(page)
    
    serializer=ProductSerializer(products,many=True)
    #return Response(products)
    return Response({'products':serializer.data , 'page':page , 'pages':paginator.num_pages})

@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serilalizer = ProductSerializer(products,many=True)
    return Response(serilalizer.data)
    

@api_view(['GET'])
def getProduct(request,pk):
    
    product=Product.objects.get(_id=pk)
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user=request.user
    product = Product.objects.create(
        user=user,
        name='sample name',
        price=0,
        brand='sample brand',
        countInStock=0,
        category = 'sample',
        description = 'sample desc',
        
        
        
    )
    
    
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request,pk):
    data = request.data
    product=Product.objects.get(_id=pk)
    
    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']
    
    
    product.save()




    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    product=Product.objects.get(_id=pk)
    product.delete()
    return Response('Product Deleted')

@api_view(['POST'])
def uploadImage(request):
    data = request.data
    
    product_id=data['product_id']
    product = Product.objects.get(_id=product_id)
    
    product.image = request.FILES.get('image')
    product.save()
    
    return Response('Image was Uploaded')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request,pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data=request.data
    
    #1 - review already exixts
    
    alreadyExists = product.review_set.filter(user=user).exists()
    
    if alreadyExists:
        content = {'detail':'Product already reviewed'}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)
    
    #2 - no rating 
    
    elif data['rating'] == 0:
        content = {'detail':'Please select a retaing'}
        return Response(content,status=status.HTTP_400_BAD_REQUEST)

        
    
    #3- create review
    
    else:
        
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating = data['rating'],
            comment = data['comment'],
        )
        
        reviews = product.review_set.all()
        product.numReviews = len(reviews)
        
        total = 0
        for  i in reviews:
            
            total+=i.rating
            
        product.rating = total/len(reviews)
        product.save()
        
        return Response('Review Added')
        
    
    
    
    




